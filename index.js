const express = require('express')
const app = express()
const port = 3000
const bodyparser = require('body-parser')

app.use(bodyparser.urlencoded({extended:true}))

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) 

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/bmiCalculator', (req,res) => {
    res.sendFile(__dirname + "/bmiCalculator.html") 
})


app.post('/bmiCalculator', (req, res) => {
    const height = parseFloat(req.body.height);
    const weight = parseFloat(req.body.weight);
    const age = parseInt(req.body.age);
    const gender = req.body.gender;
    const heightUnit = req.body.heightUnit;
    const weightUnit = req.body.weightUnit;

    if (
        isNaN(height) ||
        isNaN(weight) ||
        isNaN(age) ||
        !['male', 'female'].includes(gender) ||
        (height <= 0) ||
        (weight <= 0) ||
        (age < 0)
    ) {
        return res.status(400).json({ error: 'Invalid input. Please check your values.' });
    }

    const heightInMeters = (heightUnit === 'cm') ? height / 100 : height;
    const weightInKg = (weightUnit === 'lb') ? weight * 0.453592 : weight;

    const bmi = weightInKg / (heightInMeters * heightInMeters);

    let interpretation = '';
    if (gender === 'male') {
        if (age >= 18) {
            if (bmi < 18.5) {
                interpretation = 'Underweight';
            } else if (bmi < 24.9) {
                interpretation = 'Normal Weight';
            } else if (bmi < 29.9) {
                interpretation = 'Overweight';
            } else {
                interpretation = 'Obese';
            }
        } else {
            // For males under 18, you can define separate BMI categories
            // Adjust these categories based on your specific requirements
            // Example: For simplicity, I'm using the same categories as for adults
            if (bmi < 18.5) {
                interpretation = 'Underweight (Teen)';
            } else if (bmi < 24.9) {
                interpretation = 'Normal Weight (Teen)';
            } else if (bmi < 29.9) {
                interpretation = 'Overweight (Teen)';
            } else {
                interpretation = 'Obese (Teen)';
            }
        }
    } else if (gender === 'female') {
        // Similar logic for females, you can define separate categories for females under 18
        // Adjust these categories based on your specific requirements
        if (age >= 18) {
            if (bmi < 18.5) {
                interpretation = 'Underweight';
            } else if (bmi < 24.9) {
                interpretation = 'Normal Weight';
            } else if (bmi < 29.9) {
                interpretation = 'Overweight';
            } else {
                interpretation = 'Obese';
            }
        } else {
            // Example: Using the same categories as for adults
            if (bmi < 18.5) {
                interpretation = 'Underweight (Teen)';
            } else if (bmi < 24.9) {
                interpretation = 'Normal Weight (Teen)';
            } else if (bmi < 29.9) {
                interpretation = 'Overweight (Teen)';
            } else {
                interpretation = 'Obese (Teen)';
            }
        }
    }

    res.json({
        bmi: parseFloat(bmi.toFixed(2)),
        interpretation
    });
});
