from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

from ..services import report_service
from ..models.report_request import ReportRequest

router = APIRouter()

@router.post("/export")
async def generate_report(request: ReportRequest) -> JSONResponse:
    try:
        data = await report_service.generate_report(
            request.report_type,
            request.start,
            request.end,
            request.user_id,
            request.user_org
        )
        
        return JSONResponse(
            status_code=200,
            content={
                "report_type": request.report_type,
                "total_records": len(data),
                "data": data
            }
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
