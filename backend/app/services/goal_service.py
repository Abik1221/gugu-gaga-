from datetime import datetime, date, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from app.models.business_goal import BusinessGoal, Milestone, GoalMetric, GoalStatus, GoalType
from app.models.sales import Sale
from app.models.expense import Expense

class GoalService:
    @staticmethod
    def calculate_goal_progress(db: Session, goal: BusinessGoal) -> BusinessGoal:
        """Calculate and update goal progress based on sales/expenses data."""
        today = date.today()
        
        # Don't update if goal hasn't started yet
        if goal.start_date > today:
            return goal
        
        # Query data based on goal type
        if goal.goal_type == GoalType.REVENUE:
            # Sum all sales revenue in the date range
            total_revenue = db.query(func.sum(Sale.total_amount)).filter(
                and_(
                    Sale.tenant_id == goal.tenant_id,
                    Sale.created_at >= goal.start_date,
                    Sale.created_at <= min(goal.end_date, today)
                )
            ).scalar() or 0.0
            goal.current_amount = total_revenue
            
        elif goal.goal_type == GoalType.PROFIT:
            # Calculate revenue - expenses
            total_revenue = db.query(func.sum(Sale.total_amount)).filter(
                and_(
                    Sale.tenant_id == goal.tenant_id,
                    Sale.created_at >= goal.start_date,
                    Sale.created_at <= min(goal.end_date, today)
                )
            ).scalar() or 0.0
            
            total_expenses = db.query(func.sum(Expense.amount)).filter(
                and_(
                    Expense.tenant_id == goal.tenant_id,
                    Expense.created_at >= goal.start_date,
                    Expense.created_at <= min(goal.end_date, today)
                )
            ).scalar() or 0.0
            
            goal.current_amount = total_revenue - total_expenses
            
        elif goal.goal_type == GoalType.SALES_COUNT:
            # Count number of sales
            sales_count = db.query(func.count(Sale.id)).filter(
                and_(
                    Sale.tenant_id == goal.tenant_id,
                    Sale.created_at >= goal.start_date,
                    Sale.created_at <= min(goal.end_date, today)
                )
            ).scalar() or 0
            goal.current_amount = float(sales_count)
        
        # Update status based on progress
        if today > goal.end_date:
            if goal.current_amount >= goal.target_amount:
                goal.status = GoalStatus.ACHIEVED
            else:
                goal.status = GoalStatus.MISSED
        elif goal.current_amount >= goal.target_amount:
            goal.status = GoalStatus.ACHIEVED
        
        db.commit()
        db.refresh(goal)
        return goal
    
    @staticmethod
    def check_milestone_achievement(db: Session, goal: BusinessGoal):
        """Check and mark milestones as achieved."""
        for milestone in goal.milestones:
            if not milestone.achieved and goal.current_amount >= milestone.target_value:
                milestone.achieved = True
                milestone.achieved_at = datetime.utcnow()
        db.commit()
    
    @staticmethod
    def get_computed_fields(goal: BusinessGoal) -> dict:
        """Calculate computed fields for goal."""
        today = date.today()
        
        # Progress percentage
        progress_percentage = min((goal.current_amount / goal.target_amount * 100) if goal.target_amount > 0 else 0, 100)
        
        # Days remaining
        days_remaining = (goal.end_date - today).days if goal.end_date >= today else 0
        
        # Is on track calculation
        total_days = (goal.end_date - goal.start_date).days or 1
        days_elapsed = (today - goal.start_date).days if today >= goal.start_date else 0
        expected_progress = (days_elapsed / total_days) * goal.target_amount if today >= goal.start_date else 0
        is_on_track = goal.current_amount >= (expected_progress * 0.9)  # 90% threshold
        
        return {
            "progress_percentage": round(progress_percentage, 2),
            "days_remaining": max(days_remaining, 0),
            "is_on_track": is_on_track
        }
    
    @staticmethod
    def get_projected_completion(goal: BusinessGoal) -> Optional[date]:
        """Predict when goal will be achieved based on current rate."""
        today = date.today()
        
        if goal.current_amount >= goal.target_amount:
            return today
        
        if goal.current_amount == 0:
            return None
        
        days_elapsed = (today - goal.start_date).days
        if days_elapsed <= 0:
            return None
        
        daily_rate = goal.current_amount / days_elapsed
        if daily_rate <= 0:
            return None
        
        remaining_amount = goal.target_amount - goal.current_amount
        days_needed = remaining_amount / daily_rate
        
        projected_date = today + timedelta(days=int(days_needed))
        return projected_date if projected_date <= goal.end_date else None
    
    @staticmethod
    def get_required_daily_progress(goal: BusinessGoal) -> float:
        """Calculate required daily progress to achieve goal."""
        today = date.today()
        
        if today >= goal.end_date or goal.current_amount >= goal.target_amount:
            return 0.0
        
        days_remaining = (goal.end_date - today).days
        if days_remaining <= 0:
            return 0.0
        
        remaining_amount = goal.target_amount - goal.current_amount
        return remaining_amount / days_remaining
