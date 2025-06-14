import {GoogleGenAI} from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

const today = new Date();
const weekdayName = today.toLocaleDateString('en-US', {weekday: 'long'});

export async function askGeminiRecipes(prompt, goal_type, calories) {
    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            systemInstruction: `You are a helpful nutrition assistant.
            Always respect the user's goal: ${goal_type} and ${calories} calories.
            If the meal plan includes a day labeled "today", use the current real-world date ${weekdayName} in the response.
            Use structured output as defined in the responseSchema. Try to formulate the recipes and days names in Romanian.`,
            responseMimeType: "application/json",
            responseSchema: {
                "type": "object",
                "properties": {
                    "recipes_plan": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "week": {
                                    "type": "number"
                                },
                                "days": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "day": {
                                                "type": "string",
                                                "enum": [
                                                    "Luni",
                                                    "Marti",
                                                    "Miercuri",
                                                    "Joi",
                                                    "Vineri",
                                                    "Sambata",
                                                    "Duminica"
                                                ]
                                            },
                                            "breakfast": {
                                                "type": "object",
                                                "properties": {
                                                    "title": {
                                                        "type": "string"
                                                    },
                                                    "ingredients": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "instructions": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "calories": {
                                                        "type": "string"
                                                    },
                                                    "cooking_time": {
                                                        "type": "string"
                                                    }
                                                },
                                                "required": [
                                                    "title",
                                                    "ingredients",
                                                    "instructions",
                                                    "calories",
                                                    "cooking_time"
                                                ]
                                            },
                                            "lunch": {
                                                "type": "object",
                                                "properties": {
                                                    "title": {
                                                        "type": "string"
                                                    },
                                                    "ingredients": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "instructions": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "calories": {
                                                        "type": "string"
                                                    },
                                                    "cooking_time": {
                                                        "type": "string"
                                                    }
                                                },
                                                "required": [
                                                    "title",
                                                    "ingredients",
                                                    "instructions",
                                                    "calories",
                                                    "cooking_time"
                                                ]
                                            },
                                            "dinner": {
                                                "type": "object",
                                                "properties": {
                                                    "title": {
                                                        "type": "string"
                                                    },
                                                    "ingredients": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "instructions": {
                                                        "type": "array",
                                                        "items": {
                                                            "type": "string"
                                                        }
                                                    },
                                                    "calories": {
                                                        "type": "string"
                                                    },
                                                    "cooking_time": {
                                                        "type": "string"
                                                    }
                                                },
                                                "required": [
                                                    "title",
                                                    "ingredients",
                                                    "instructions",
                                                    "calories",
                                                    "cooking_time"
                                                ]
                                            },
                                            "snacks": {
                                                "type": "array",
                                                "items": {
                                                    "type": "string"
                                                }
                                            }
                                        },
                                        "required": [
                                            "day",
                                            "breakfast",
                                            "lunch",
                                            "dinner",
                                            "snacks"
                                        ]
                                    }
                                },
                                "notes": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "days",
                                "week",
                                "notes"
                            ]
                        }
                    }
                },
                "required": [
                    "recipes_plan"
                ]
            }
        }
    });
    return response.text;
}

export async function askGeminiWorkouts(prompt, goal_type, calories) {
    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            systemInstruction: `You are a helpful fitness and workout assistant.
              Always respect the user's goal: ${goal_type} and ${calories} calories.
              Use structured output as defined in the responseSchema. Do not include Sunday workouts, its rest day. 
              Try equilibrate the number of exercises per day. Try to formulate the exercises in Romanian.`,
            responseMimeType: "application/json",
            responseSchema: {
                "type": "object",
                "properties": {
                    "workout_plan": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "important_consideration": {
                                    "type": "string"
                                },
                                "week": {
                                    "type": "string"
                                },
                                "days": {
                                    "type": "object",
                                    "properties": {
                                        "day": {
                                            "type": "string",
                                            "enum": [
                                                "Luni",
                                                "Marti",
                                                "Miercuri",
                                                "Joi",
                                                "Vineri",
                                                "Sambata",
                                                "Duminica"
                                            ]
                                        },
                                        "focus": {
                                            "type": "string"
                                        },
                                        "exercises": {
                                            "type": "array",
                                            "items": {
                                                "type": "object",
                                                "properties": {
                                                    "name": {
                                                        "type": "string"
                                                    },
                                                    "sets": {
                                                        "type": "number"
                                                    },
                                                    "reps": {
                                                        "type": "number"
                                                    },
                                                    "rest": {
                                                        "type": "string"
                                                    },
                                                    "notes": {
                                                        "type": "string"
                                                    }
                                                },
                                                "required": [
                                                    "name",
                                                    "sets",
                                                    "reps",
                                                    "rest",
                                                    "notes"
                                                ]
                                            }
                                        },
                                        "duration": {
                                            "type": "string"
                                        },
                                        "intensity": {
                                            "type": "string"
                                        },
                                        "warmup": {
                                            "type": "string"
                                        },
                                        "cooldown": {
                                            "type": "string"
                                        }
                                    },
                                    "required": [
                                        "day",
                                        "focus",
                                        "exercises",
                                        "duration",
                                        "intensity"
                                    ]
                                }
                            },
                            "required": [
                                "important_consideration",
                                "week",
                                "days"
                            ]
                        }
                    }
                },
                "required": [
                    "workout_plan"
                ]
            }
        }
    });
    return response.text;
}

export async function askGeminiEverything(prompt, goal_type, calories) {
    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            systemInstruction: `
            If the user asks about anything unrelated to fitness, health, gym, or physical exercises,
            respond with a clear, well-structured message that politely redirects or explains
            you specialize in fitness and workout guidance.
            
            Try to formulate all exercise-related advice and messages in Romanian.
            `,
        }
    });
    return response.text;
}

