from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

driver = webdriver.Chrome()

try:
    driver.get("https://all-in-one-fullstack-4uz8.vercel.app/")

    # Wait until the page title contains expected text
    WebDriverWait(driver, 10).until(EC.title_contains("Expected Title"))
    print("Page title is:", driver.title)

    # Example of finding an element and interacting with it:
    # Wait explicitly for a specific element to be clickable (10 seconds max)
    # try:
    #     element = WebDriverWait(driver, 10).until(
    #         EC.element_to_be_clickable((By.ID, "element_id"))
    #     )
    #     element.click()
    #     print("Element clicked.")
    # except TimeoutException:
    #     print("Element was not clickable within the timeout period.")

    # # Perform another action, like finding a text box and inputting text
    # try:
    #     input_box = WebDriverWait(driver, 10).until(
    #         EC.presence_of_element_located((By.NAME, "input_box_name"))
    #     )
    #     input_box.send_keys("Some Text")
    #     print("Text inputted successfully.")
    # except TimeoutException:
    #     print("Input box was not found within the timeout period.")

    # # Add assertions to verify the expected outcome
    # assert "Expected Title" in driver.title, "Title does not match expected value"

finally:
    # Clean up and close the driver
    driver.quit()
