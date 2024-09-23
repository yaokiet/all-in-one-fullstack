from extensions import db

class Team(db.Model):
    __tablename__ = 'teams'

    Team_ID = db.Column(db.Integer, primary_key=True)
    Team_Name = db.Column(db.String(100), nullable=True)
    Team_Lead_ID = db.Column(db.Integer, db.ForeignKey('employees.Staff_ID'), nullable=True)
    Team_Size = db.Column(db.Integer, nullable=True)

    def serialize(self):
        return {
            'team_id': self.Team_ID,
            'team_name': self.Team_Name,
            'team_lead_id': self.Team_Lead_ID,
            'team_size':self.Team_Size
        }
