from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field, validator
from app.models.business_goal import GoalType, GoalStatus

class MilestoneBase(BaseModel):
    title: str
    target_value: float = Field(..., gt=0)
    description: Optional[str] = None

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneOut(MilestoneBase):
    id: int
    goal_id: int
    achieved: bool
    achieved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        orm_mode = True


class BusinessGoalBase(BaseModel):
    title: str
    goal_type: GoalType
    target_amount: float = Field(..., gt=0)
    start_date: date
    end_date: date
    description: Optional[str] = None

    @validator('end_date')
    def end_date_after_start(cls, v, values):
        if 'start_date' in values and v <= values['start_date']:
            raise ValueError('end_date must be after start_date')
        return v


class BusinessGoalCreate(BusinessGoalBase):
    milestones: Optional[List[MilestoneCreate]] = []


class BusinessGoalUpdate(BaseModel):
    title: Optional[str] = None
    target_amount: Optional[float] = None
    end_date: Optional[date] = None
    status: Optional[GoalStatus] = None
    description: Optional[str] = None


class BusinessGoalOut(BusinessGoalBase):
    id: int
    tenant_id: str
    current_amount: float
    status: GoalStatus
    created_at: datetime
    updated_at: datetime
    milestones: List[MilestoneOut] = []
    
    # Computed fields
    progress_percentage: Optional[float] = None
    days_remaining: Optional[int] = None
    is_on_track: Optional[bool] = None

    class Config:
        orm_mode = True


class GoalProgressResponse(BaseModel):
    goal: BusinessGoalOut
    daily_metrics: List[dict]
    projected_completion_date: Optional[date] = None
    average_daily_progress: float
    required_daily_progress: float
