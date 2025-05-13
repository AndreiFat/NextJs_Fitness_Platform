import {GoogleGenAI} from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});

export async function askGeminiRecipes(prompt) {
    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
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
                                                    "Monday",
                                                    "Tuesday",
                                                    "Wednesday",
                                                    "Thursday",
                                                    "Friday",
                                                    "Saturday",
                                                    "Sunday"
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

export async function askGeminiWorkouts(prompt) {
    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
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
                                                "Monday",
                                                "Tuesday",
                                                "Wednesday",
                                                "Thursday",
                                                "Friday",
                                                "Saturday",
                                                "Sunday"
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

export async function askGeminiEverything(prompt) {
    const response = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt
    });
    return response.text;
}

