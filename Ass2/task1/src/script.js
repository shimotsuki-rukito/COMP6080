console.log("Hello world - view me in the Console of developer tools");
document.addEventListener("DOMContentLoaded", function () {
  const streetNameInput = document.getElementById("street-name");
  const suburbInput = document.getElementById("suburb");
  const postcodeInput = document.getElementById("postcode");
  const dobInput = document.getElementById("dob");
  const buildingTypeSelect = document.getElementById("building-type");
  const featuresCheckboxes = document.querySelectorAll(
    'input[name="features"]'
  );
  const selectAllBtn = document.getElementById("select-all-btn");
  const resetFormBtn = document.getElementById("reset-form");
  const formResultTextarea = document.getElementById("form-result");

  // Select All / Deselect All button logic
  let isAllFeaturesSelected = false;
  selectAllBtn.addEventListener("click", function () {
    isAllFeaturesSelected = !isAllFeaturesSelected;
    featuresCheckboxes.forEach((checkbox) => {
      checkbox.checked = isAllFeaturesSelected;
    });
    selectAllBtn.value = isAllFeaturesSelected ? "Deselect All" : "Select All";
    renderOutput();
  });

  // Reset button logic
  resetFormBtn.addEventListener("click", function () {
    formResultTextarea.value = "";
    resetForm();
  });

  // Event listeners for inputs
  [
    streetNameInput,
    suburbInput,
    postcodeInput,
    dobInput,
    buildingTypeSelect,
  ].forEach((input) => {
    input.addEventListener("change", renderOutput);
  });

  featuresCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      renderOutput();
      updateSelectAllButtonState();
    });
  });

  function updateSelectAllButtonState() {
    const areAllFeaturesSelected = Array.from(featuresCheckboxes).every(
      (checkbox) => checkbox.checked
    );
    isAllFeaturesSelected = areAllFeaturesSelected;
    selectAllBtn.value = isAllFeaturesSelected ? "Deselect All" : "Select All";
  }

  // Function to reset form to default state
  function resetForm() {
    streetNameInput.value = "";
    suburbInput.value = "";
    postcodeInput.value = "";
    dobInput.value = "";
    buildingTypeSelect.value = "apartment";
    featuresCheckboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    isAllFeaturesSelected = false;
    selectAllBtn.value = "Select All";
  }

  // Function to render output in textarea
  function renderOutput() {
    const streetName = streetNameInput.value.trim();
    const suburb = suburbInput.value.trim();
    const postcode = postcodeInput.value.trim();
    const dob = dobInput.value.trim();
    const buildingType = buildingTypeSelect.value;
    const selectedFeatures = Array.from(featuresCheckboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    let output = "";

    if (!streetName || streetName.length < 3 || streetName.length > 50) {
      output = "Please input a valid street name";
    } else if (!suburb || suburb.length < 3 || suburb.length > 50) {
      output = "Please input a valid suburb";
    } else if (!postcode || !/^\d{4}$/.test(postcode)) {
      output = "Please input a valid postcode";
    } else if (!dob || !/^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/.test(dob)) {
      output = "Please enter a valid date of birth";
    } else {
      const isValidDate = validateDate(dob);

      if (!isValidDate) {
        output = "Please enter a valid date of birth";
      } else {
        const dobArray = dob.split("/");
        const birthDate = new Date(dobArray[2], dobArray[1] - 1, dobArray[0]);
        const currentDate = new Date();
        const age = calculateAge(birthDate, currentDate);

        output = `You are ${age} years old, and your address is ${streetName} St, ${suburb}, ${postcode}, Australia. Your building is ${getBuildingTypeArticle(
          buildingType
        )} ${buildingType}, and it has ${getFeaturesText(selectedFeatures)}`;
      }
    }

    formResultTextarea.value = output;
  }

  function validateDate(dateString) {
    var dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (!dateRegex.test(dateString)) {
      return false;
    }

    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10) - 1;
    var year = parseInt(parts[2], 10);
    var date = new Date(year, month, day);

    return (
      date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year
    );
  }

  // Function to calculate age
  function calculateAge(birthDate, currentDate) {
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  // Function to get appropriate article for building type
  function getBuildingTypeArticle(buildingType) {
    return buildingType.toLowerCase() === "apartment" ? "an" : "a";
  }

  // Function to format features text
  function getFeaturesText(features) {
    if (features.length === 0) {
      return "no features";
    } else if (features.length === 1) {
      return features[0];
    } else {
      const lastFeature = features.pop();
      return `${features.join(", ")} and ${lastFeature}`;
    }
  }
});
