from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.deps import get_db, require_tenant
from app.models.business_goal import BusinessGoal, Milestone, GoalStatus, GoalType
from app.schemas.business_goal import (
    BusinessGoalCreate,
    BusinessGoalUpdate,
    BusinessGoalOut,
    MilestoneCreate,
    MilestoneOut,
    GoalProgressResponse
)
from app.services.goal_service import GoalService

router = APIRouter()

@router.get("", response_model=List[BusinessGoalOut])
def list_goals(
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
    status: Optional[GoalStatus] = None,
    goal_type: Optional[GoalType] = None,
):
    query = db.query(BusinessGoal).filter(BusinessGoal.tenant_id == tenant_id)
    
    if status:
        query = query.filter(BusinessGoal.status == status)
    if goal_type:
        query = query.filter(BusinessGoal.goal_type == goal_type)
    
    goals = query.order_by(desc(BusinessGoal.created_at)).all()
    
    # Add computed fields to each goal
    result = []
    for goal in goals:
        goal_dict = BusinessGoalOut.from_orm(goal).dict()
        goal_dict.update(GoalService.get_computed_fields(goal))
        result.append(BusinessGoalOut(**goal_dict))
    
    return result

@router.post("", response_model=BusinessGoalOut)
def create_goal(
    goal_in: BusinessGoalCreate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
):
    # Create goal
    goal_data = goal_in.dict(exclude={"milestones"})
    goal = BusinessGoal(**goal_data, tenant_id=tenant_id)
    db.add(goal)
    db.flush()
    
    # Add milestones if provided
    for milestone_data in goal_in.milestones:
        milestone = Milestone(**milestone_data.dict(), goal_id=goal.id)
        db.add(milestone)
    
    db.commit()
    db.refresh(goal)
    
    # Calculate initial progress
    GoalService.calculate_goal_progress(db, goal)
    
    goal_dict = BusinessGoalOut.from_orm(goal).dict()
    goal_dict.update(GoalService.get_computed_fields(goal))
    return BusinessGoalOut(**goal_dict)

@router.get("/{goal_id}", response_model=BusinessGoalOut)
def get_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
):
    goal = db.query(BusinessGoal).filter(
        BusinessGoal.id == goal_id,
        BusinessGoal.tenant_id == tenant_id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Update progress before returning
    GoalService.calculate_goal_progress(db, goal)
    GoalService.check_milestone_achievement(db, goal)
    
    goal_dict = BusinessGoalOut.from_orm(goal).dict()
    goal_dict.update(GoalService.get_computed_fields(goal))
    return BusinessGoalOut(**goal_dict)

@router.put("/{goal_id}", response_model=BusinessGoalOut)
def update_goal(
    goal_id: int,
    goal_in: BusinessGoalUpdate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
):
    goal = db.query(BusinessGoal).filter(
        BusinessGoal.id == goal_id,
        BusinessGoal.tenant_id == tenant_id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    update_data = goal_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(goal, field, value)
    
    db.commit()
    db.refresh(goal)
    
    # Recalculate progress
    GoalService.calculate_goal_progress(db, goal)
    
    goal_dict = BusinessGoalOut.from_orm(goal).dict()
    goal_dict.update(GoalService.get_computed_fields(goal))
    return BusinessGoalOut(**goal_dict)

@router.delete("/{goal_id}")
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
):
    goal = db.query(BusinessGoal).filter(
        BusinessGoal.id == goal_id,
        BusinessGoal.tenant_id == tenant_id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
   # Archive instead of delete
    goal.status = GoalStatus.ARCHIVED
    db.commit()
    
    return {"status": "success"}

@router.post("/{goal_id}/milestones", response_model=MilestoneOut)
def add_milestone(
    goal_id: int,
    milestone_in: MilestoneCreate,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
):
    goal = db.query(BusinessGoal).filter(
        BusinessGoal.id == goal_id,
        BusinessGoal.tenant_id == tenant_id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    milestone = Milestone(**milestone_in.dict(), goal_id=goal_id)
    db.add(milestone)
    db.commit()
    db.refresh(milestone)
    
    return milestone

@router.get("/{goal_id}/progress", response_model=GoalProgressResponse)
def get_goal_progress(
    goal_id: int,
    db: Session = Depends(get_db),
    tenant_id: str = Depends(require_tenant),
):
    goal = db.query(BusinessGoal).filter(
        BusinessGoal.id == goal_id,
        BusinessGoal.tenant_id == tenant_id
    ).first()
    
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    
    # Update progress
    GoalService.calculate_goal_progress(db, goal)
    
    goal_dict = BusinessGoalOut.from_orm(goal).dict()
    goal_dict.update(GoalService.get_computed_fields(goal))
    goal_out = BusinessGoalOut(**goal_dict)
    
    # Calculate metrics
    projected_date = GoalService.get_projected_completion(goal)
    required_daily = GoalService.get_required_daily_progress(goal)
    
    # For now, return empty daily_metrics array
    # This would be populated from GoalMetrics table in production
    daily_metrics = []
    
    return GoalProgressResponse(
        goal=goal_out,
        daily_metrics=daily_metrics,
        projected_completion_date=projected_date,
        average_daily_progress=goal.current_amount / max((goal.end_date - goal.start_date).days, 1),
        required_daily_progress=required_daily
    )
