from sqlalchemy import Column, Integer, String, Text
from data.astrology_db import Base

class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True)
    user_hash = Column(String, unique=True, nullable=False)
    result_text = Column(Text, nullable=False)
    image_path = Column(String, nullable=False)

class Fortune(Base):
    __tablename__ = "fortunes"

    id = Column(Integer, primary_key=True)
    user_hash = Column(String, unique=True, nullable=False)
    result_text = Column(Text, nullable=False)