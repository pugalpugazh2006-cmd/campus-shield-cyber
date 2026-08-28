from app.db.database import Base, engine
from app.db.models import *
import logging

logging.basicConfig(level=logging.INFO)

print("Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("Creating all tables...")
Base.metadata.create_all(bind=engine)
print("Done!")
