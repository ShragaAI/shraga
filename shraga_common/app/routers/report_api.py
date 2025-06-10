from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse

from ..services import report_service

router = APIRouter()

@router.get("/export")
async def generate_report(
    report_type: str,
    start: Optional[str] = Query(None, description="Start date in YYYY-MM-DD HH:MM:SS format"),
    end: Optional[str] = Query(None, description="End date in YYYY-MM-DD HH:MM:SS format"),
    user_id: Optional[str] = None,
    user_org: Optional[str] = None
) -> JSONResponse:
    try:
        data = await report_service.generate_report(
            report_type,
            start,
            end,
            user_id,
            user_org
        )
        
        return JSONResponse(
            status_code=200,
            content={
                "report_type": report_type,
                "total_records": len(data),
                "data": data
            }
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
