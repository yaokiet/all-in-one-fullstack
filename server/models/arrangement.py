from extensions import db

class WorkArrangement(db.Model):
    __tablename__ = 'work_arrangements'

    Arrangement_ID = db.Column(db.Integer, primary_key = True)
    Staff_ID = db.Column(db.Integer, db.ForeignKey('users.Staff_ID'),nullable = False)
    Approving_ID = db.Column(db.Integer, db.ForeignKey('users.Staff_ID') , nullable = False)
    Arrangement_Type = db.Column(db.String(20), nullable = False)
    Arrangement_Date = db.Column(db.Date, nullable = False)
    Status = db.Column(db.String(20), nullable = False)
    Application_Date = db.Column(db.DateTime, nullable = False)
    Approval_Date = db.Column(db.DateTime, nullable = False)

    def serialize(self):
        return {
            'arrangement_id' : self.Arrangement_ID,
            'staff_id' : self.Staff_ID,
            'approving_id' : self.Approving_ID,
            'arrangement_type' : self.Arrangement_Type,
            'arrangement_date' : self.Arrangement_Date.isoformat(),
            'status' : self.Status,
            'application_date' : self.Application_Date.isoformat(),
            'approval_date' : self.Approval_Date.isoformat()
        }