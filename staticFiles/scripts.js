let currentOption = 1;
let mydata;

document.addEventListener('DOMContentLoaded', function () {

    console.log(document.getElementById('event').value);

    document.getElementById('event').addEventListener('click', function () {
        const selectedEvent = this.value;
        const spouseNameField = document.getElementById('spouseNameBlock');
        const hallField = document.getElementById('hallBlock');
        const ageField = document.getElementById('ageBlock');
        const seasonField = document.getElementById('seasonBlock');

        spouseNameField.style.display = (selectedEvent === 'wedding') ? 'block' : 'none';
        hallField.style.display = (selectedEvent === 'wedding') ? 'block' : 'none';
        ageField.style.display = (selectedEvent === 'birthday') ? 'block' : 'none';
        seasonField.style.display = (selectedEvent === 'birthday') ? 'block' : 'none';
    });
});

function submitForm() {

    currentOption = 1;

    if (!validateForm()) {
        return;
    }

    document.getElementById('responseContainer').innerHTML = '';

    displayLoadingMessage();

    const formData = {
        event: document.getElementById('event').value,
        name: document.getElementById('name').value,
        blessingType: document.getElementById('blessingType').value,
        atmosphere: document.getElementById('atmosphere').value,
    };

    if (formData.event === 'wedding') {
        formData.spouseName = document.getElementById('spouseName').value;
        formData.hall = document.getElementById('hall').value;
    } else if (formData.event === 'birthday') {
        formData.age = document.getElementById('age').value;
        formData.season = document.getElementById('season').value;
    }

    displaySelectedValues(formData);
    hideFormFields();
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            mydata = data;
            console.log('my data:', mydata);

            displayBlessingOption(data);

        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function displayLoadingMessage() {
    const responseContainer = document.getElementById('responseContainer');
    responseContainer.innerHTML = '<p>Loading...</p>';
}


function displayBlessingOption(data) {
    const responseContainer = document.getElementById('responseContainer');

    const blessingOptionDiv = document.createElement('div');

    if (data.poems && data.poems['option 1']) {
        const poemKey = `option ${currentOption}`;
        const poemValue = data.poems[poemKey];

        const poemLines = poemValue.split('\n');

        for (const line of poemLines) {
            const lineParagraph = document.createElement('div');
            lineParagraph.textContent = line;
            blessingOptionDiv.appendChild(lineParagraph);
        }
        document.getElementById('nextBlessingBtn').style.display = 'block';
    } else {
        const tryAgainButton = document.createElement('button');
        tryAgainButton.innerText = 'Try Again';
        tryAgainButton.addEventListener('click', function () {
            clearSelectedValues();
            submitForm();
        });
        blessingOptionDiv.appendChild(tryAgainButton);
    }

    responseContainer.innerHTML = '';

    responseContainer.appendChild(blessingOptionDiv);
}

function clearSelectedValues() {
    const selectedValuesContainer = document.getElementById('selectedValuesContainer');
    selectedValuesContainer.innerHTML = '';
}

function showNextBlessing() {
    currentOption++;
    const buttonText = (currentOption === 2) ? 'Give me the final blessing' : 'Give me another blessing';
    document.getElementById('nextBlessingBtn').innerText = buttonText;

    displayBlessingOption(mydata);

    if (currentOption === 3) {
        document.getElementById('nextBlessingBtn').style.display = 'none';
    }
}

function displaySelectedValues(formData) {
    const selectedValuesContainer = document.getElementById('selectedValuesContainer');

    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            const value = formData[key];

            const selectedValueButton = document.createElement('button');
            selectedValueButton.innerHTML = `${value}`;

            selectedValueButton.classList.add('clickable-values');

            selectedValueButton.addEventListener('click', function () {
                showFormFields();
                selectedValuesContainer.innerHTML = '';

                document.getElementById('nextBlessingBtn').style.display = 'none';

            });

            selectedValuesContainer.appendChild(selectedValueButton);
        }
    }
}

function showFormFields() {
    const blessingForm = document.getElementById('blessingForm');

    const responseContainer = document.getElementById('responseContainer');
    responseContainer.innerHTML = '';

    blessingForm.style.display = 'block';
}

function hideFormFields() {
    const blessingForm = document.getElementById('blessingForm');

    blessingForm.style.display = 'none';
}

function validateForm() {
    const eventField = document.getElementById('event');
    const nameField = document.getElementById('name');
    const blessingTypeField = document.getElementById('blessingType');
    const atmosphereField = document.getElementById('atmosphere');

    if (
        eventField.value.trim() === '' ||
        nameField.value.trim() === '' ||
        blessingTypeField.value.trim() === '' ||
        atmosphereField.value.trim() === ''
    ) {
        alert('Please fill in all required fields.');
        return false;
    }
    if (eventField.value === 'wedding') {
        const spouseNameField = document.getElementById('spouseName');
        const hallField = document.getElementById('hall');
        if (spouseNameField.value.trim() === '' ||
            hallField.value.trim() === '') {
            alert('Please fill in all required fields.');
            return false;
        }
    }
    if (eventField.value === 'birthday') {
        const ageField = document.getElementById('age');
        const seasonField = document.getElementById('season');
        if (ageField.value.trim() === '' ||
            seasonField.value.trim() === '') {
            alert('Please fill in all required fields.');
            return false;
        }
    }
    return true;
}