from extensions import db

class Arrangement(db.Model):
    __tablename__ = 'work_arrangements'

    Arrangement_ID = db.Column(db.Integer, primary_key = True)
    Staff_ID = db.Column(db.Integer, db.ForeignKey('employees.Staff_ID'),index=True, nullable = False)
    Approving_ID = db.Column(db.Integer, db.ForeignKey('employees.Staff_ID') , index=True, nullable = False)
    Arrangement_Type = db.Column(db.String(20), nullable = False)
    Arrangement_Date = db.Column(db.Date, nullable = False)
    AM_PM = db.Column(db.String(2), nullable=False)
    Status = db.Column(db.String(20), nullable = False)
    Application_Date = db.Column(db.DateTime, nullable = False)
    Approval_Date = db.Column(db.DateTime, nullable = True)
    Reason = db.Column(db.String(255), nullable = True)
    Manager_Reason = db.Column(db.String(255), nullable = True)

    def serialize(self):
        return {
            'arrangement_id' : self.Arrangement_ID,
            'staff_id' : self.Staff_ID,
            'approving_id' : self.Approving_ID,
            'arrangement_type' : self.Arrangement_Type,
            'arrangement_date' : self.Arrangement_Date.isoformat(),
            'am_pm': self.AM_PM,
            'status' : self.Status,
            'application_date' : self.Application_Date.isoformat(),
            'approval_date' : self.Approval_Date.isoformat() if self.Approval_Date else None,
            'reason' : self.Reason,
            'manager_reason': self.Manager_Reason,
        }