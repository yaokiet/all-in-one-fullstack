from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()

driver.get("http://localhost:3000/")
print(driver.title)

driver.quit()