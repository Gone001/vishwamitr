-- ==============================================
-- Vishwa Mitr Quiz System - Database Setup
-- Run this in Supabase SQL Editor
-- ==============================================

-- ==============================================
-- Create Questions Table
-- ==============================================
CREATE TABLE IF NOT EXISTS questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_idx INTEGER NOT NULL CHECK (correct_idx >= 0 AND correct_idx <= 3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- Create Quiz Results Table
-- ==============================================
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    time_taken INTEGER NOT NULL,
    difficulty TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- Enable Row Level Security
-- ==============================================
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- Questions Table Policies
-- ==============================================
CREATE POLICY "Anyone can read questions" ON questions
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert questions" ON questions
    FOR INSERT WITH CHECK (true);

-- ==============================================
-- Quiz Results Table Policies
-- ==============================================
CREATE POLICY "Users can read own quiz results" ON quiz_results
    FOR SELECT USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert own quiz results" ON quiz_results
    FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

-- ==============================================
-- Seed Physics Questions
-- ==============================================
INSERT INTO questions (subject, difficulty, question, options, correct_idx) VALUES
('Physics', 'easy', 'What is Newton''s First Law of Motion also known as?', '["Law of Acceleration", "Law of Inertia", "Law of Action-Reaction", "Law of Gravity"]', 1),
('Physics', 'easy', 'Which of the following is the SI unit of force?', '["Joule", "Watt", "Newton", "Pascal"]', 2),
('Physics', 'medium', 'What is the formula for kinetic energy?', '["1/2 mv", "1/2 mv^2", "mv^2", "2mv"]', 1),
('Physics', 'medium', 'What is the speed of light in vacuum (approx)?', '["3 x 10^6 m/s", "3 x 10^7 m/s", "3 x 10^8 m/s", "3 x 10^9 m/s"]', 2),
('Physics', 'hard', 'A body of mass 5kg is moving with velocity 10m/s. Find its momentum.', '["50 kgm/s", "100 kgm/s", "25 kgm/s", "5 kgm/s"]', 0),
('Physics', 'easy', 'What is the unit of electrical resistance?', '["Volt", "Ampere", "Ohm", "Watt"]', 2),
('Physics', 'medium', 'Two bodies of masses m and 2m have equal kinetic energy. Find ratio of their momenta.', '["1:2", "2:1", "1:√2", "√2:1"]', 0),
('Physics', 'hard', 'A wire of resistance R is stretched to double its length. Find new resistance.', '["R/4", "R/2", "2R", "4R"]', 3),
('Physics', 'easy', 'What is the phenomenon of light bending when it passes through a prism called?', '["Reflection", "Refraction", "Dispersion", "Diffraction"]', 2),
('Physics', 'medium', 'The time period of a simple pendulum depends on:', '["Mass only", "Length only", "Amplitude only", "Mass and amplitude"]', 1);

-- ==============================================
-- Seed Mathematics Questions
-- ==============================================
INSERT INTO questions (subject, difficulty, question, options, correct_idx) VALUES
('Mathematics', 'easy', 'What is the derivative of sin(x)?', '["-cos(x)", "cos(x)", "tan(x)", "-sin(x)"]', 1),
('Mathematics', 'easy', 'What is the value of pi to two decimal places?', '["3.12", "3.14", "3.16", "3.18"]', 1),
('Mathematics', 'medium', 'Find the derivative of x^3 + 2x^2 + 3x + 4', '["3x^2 + 4x + 3", "3x^2 + 2x + 3", "x^3 + 4x + 3", "3x^3 + 4x^2"]', 0),
('Mathematics', 'medium', 'What is the integral of 2x dx?', '["x^2 + C", "x + C", "2x^2 + C", "x^2/2 + C"]', 0),
('Mathematics', 'hard', 'Evaluate: lim(x->0) sin(x)/x', '["0", "1", "Infinity", "Does not exist"]', 1),
('Mathematics', 'easy', 'What is 15% of 200?', '["25", "30", "35", "40"]', 1),
('Mathematics', 'medium', 'Solve: 2x + 5 = 15', '["x = 5", "x = 10", "x = 7.5", "x = 4"]', 0),
('Mathematics', 'hard', 'If A = [1,2] and B = [3,4], find |A + B|', '["8", "10", "12", "14"]', 1),
('Mathematics', 'easy', 'What is the square root of 144?', '["10", "11", "12", "14"]', 2),
('Mathematics', 'medium', 'Find the area of a circle with radius 7cm (use π = 22/7)', '["154 cm^2", "144 cm^2", "164 cm^2", "132 cm^2"]', 0);

-- ==============================================
-- Seed Chemistry Questions
-- ==============================================
INSERT INTO questions (subject, difficulty, question, options, correct_idx) VALUES
('Chemistry', 'easy', 'What is the atomic number of Carbon?', '["4", "6", "8", "12"]', 1),
('Chemistry', 'easy', 'What is the chemical symbol for Gold?', '["Ag", "Au", "Go", "Gd"]', 1),
('Chemistry', 'medium', 'What is the pH of a neutral solution?', '["0", "7", "14", "1"]', 1),
('Chemistry', 'medium', 'How many moles are in 36g of water (H2O)?', '["1 mole", "2 moles", "3 moles", "0.5 moles"]', 1),
('Chemistry', 'hard', 'What is the IUPAC name of CH3-CH=CH-CH3?', '["Butane", "1-Butene", "2-Butene", "Isobutane"]', 2),
('Chemistry', 'easy', 'What is the molecular formula of water?', '["H2O", "CO2", "NaCl", "O2"]', 0),
('Chemistry', 'medium', 'Which element has the highest electronegativity?', '["Oxygen", "Nitrogen", "Fluorine", "Chlorine"]', 2),
('Chemistry', 'hard', 'In a redox reaction, what happens to the reducing agent?', '["It gets oxidized", "It gets reduced", "It acts as catalyst", "Nothing happens"]', 0),
('Chemistry', 'easy', 'What is the gas produced when an acid reacts with a metal?', '["Oxygen", "Nitrogen", "Hydrogen", "Carbon dioxide"]', 2),
('Chemistry', 'medium', 'What type of bond is formed between Na and Cl in NaCl?', '["Covalent", "Ionic", "Metallic", "Hydrogen"]', 1);

-- ==============================================
-- Seed Biology Questions
-- ==============================================
INSERT INTO questions (subject, difficulty, question, options, correct_idx) VALUES
('Biology', 'easy', 'What is the powerhouse of the cell?', '["Nucleus", "Mitochondria", "Ribosome", "Golgi body"]', 1),
('Biology', 'easy', 'Which blood group is known as the universal donor?', '["A", "B", "AB", "O"]', 3),
('Biology', 'medium', 'What is the functional unit of the kidney?', '["Neuron", "Nephron", "Alveoli", "Hepatocyte"]', 1),
('Biology', 'medium', 'Which hormone is responsible for regulating blood sugar?', '["Insulin", "Thyroxine", "Adrenaline", "Cortisol"]', 0),
('Biology', 'hard', 'What is the process by which plants make food using sunlight?', '["Respiration", "Photosynthesis", "Transpiration", "Osmosis"]', 1),
('Biology', 'easy', 'What is the largest organ in the human body?', '["Heart", "Liver", "Skin", "Brain"]', 2),
('Biology', 'medium', 'Which part of the brain controls balance and coordination?', '["Cerebrum", "Cerebellum", "Medulla", "Hypothalamus"]', 1),
('Biology', 'hard', 'How many chromosomes do human cells normally have?', '["23", "44", "46", "48"]', 2),
('Biology', 'easy', 'What is the process of cell division called?', '["Mitosis", "Diffusion", "Osmosis", "Absorption"]', 0),
('Biology', 'medium', 'Which vitamin is produced when skin is exposed to sunlight?', '["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"]', 3);

-- ==============================================
-- Seed History Questions
-- ==============================================
INSERT INTO questions (subject, difficulty, question, options, correct_idx) VALUES
('History', 'easy', 'In which year did World War II end?', '["1943", "1944", "1945", "1946"]', 2),
('History', 'easy', 'Who was the first President of the United States?', '["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"]', 2),
('History', 'medium', 'The Indian Independence Act was passed in which year?', '["1945", "1946", "1947", "1948"]', 2),
('History', 'medium', 'Which empire was ruled by Genghis Khan?', '["Roman", "Mongol", "Ottoman", "British"]', 1),
('History', 'hard', 'The Battle of Plassey was fought in which year?', '["1757", "1857", "1947", "1600"]', 0),
('History', 'easy', 'Who wrote the Indian national anthem?', '["Bankim Chandra", "Rabindranath Tagore", "Aurobindo Ghosh", "Mahatma Gandhi"]', 1),
('History', 'medium', 'The Great Wall of China was built to protect against invasions from which direction?', '["South", "East", "West", "North"]', 3),
('History', 'hard', 'The French Revolution began in which year?', '["1776", "1789", "1799", "1804"]', 1),
('History', 'easy', 'Which country gifted the Statue of Liberty to the USA?', '["England", "France", "Spain", "Germany"]', 1),
('History', 'medium', 'The Quit India Movement was launched in which year?', '["1940", "1942", "1944", "1946"]', 1);

-- ==============================================
-- Seed Geography Questions
-- ==============================================
INSERT INTO questions (subject, difficulty, question, options, correct_idx) VALUES
('Geography', 'easy', 'What is the capital of India?', '["Mumbai", "Delhi", "Kolkata", "Chennai"]', 1),
('Geography', 'easy', 'Which is the largest continent by area?', '["Africa", "North America", "Asia", "Europe"]', 2),
('Geography', 'medium', 'Which is the longest river in the world?', '["Amazon", "Nile", "Yangtze", "Mississippi"]', 1),
('Geography', 'medium', 'The Tropic of Cancer passes through how many Indian states?', '["6", "8", "10", "12"]', 1),
('Geography', 'hard', 'Which mountain range separates the Indo-Gangetic plain from the Deccan plateau?', '["Himalayas", "Vindhyas", "Western Ghats", "Eastern Ghats"]', 1),
('Geography', 'easy', 'What is the largest ocean in the world?', '["Atlantic", "Indian", "Pacific", "Arctic"]', 2),
('Geography', 'medium', 'Which desert is known as the coldest desert in the world?', '["Sahara", "Arabian", "Gobi", "Antarctic"]', 3),
('Geography', 'hard', 'The Sundarbans are located in which delta?', '["Ganges-Brahmaputra", "Mekong", "Nile", "Amazon"]', 0),
('Geography', 'easy', 'Which country has the largest population?', '["USA", "India", "China", "Indonesia"]', 2),
('Geography', 'medium', 'Mount Everest is located in which mountain range?', '["Andes", "Alps", "Rockies", "Himalayas"]', 3);

-- ==============================================
-- Verify Data
-- ==============================================
SELECT subject, difficulty, COUNT(*) as count FROM questions GROUP BY subject, difficulty ORDER BY subject, difficulty;
