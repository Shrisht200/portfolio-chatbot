from flask import Flask, request, jsonify
from flask_cors import CORS

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

import numpy as np
import json

app = Flask(__name__)
CORS(app)


model = SentenceTransformer(
    'all-MiniLM-L6-v2'
)

with open("../data/knowledge.json", "r", encoding="utf-8") as file:
    knowledge_base = json.load(file)

questions = [
    item["question"]
    for item in knowledge_base
]

question_embeddings = model.encode(
    questions
)

@app.route("/")
def home():

    return "AI Chatbot Backend Running"

@app.route("/chat", methods=["POST"])
def chat():

    user_message = request.json["message"].lower().strip()

    if any(word in user_message for word in [
        "company",
        "current company",
        "company name",
        "where work",
        "working", "job", "position", "role", "experience", "work", "employer", "occupation", "profession", "career"
    ]):
        return jsonify({
            "answer":
            "Shrishti currently works as an AI/ML Software Engineer at Navitasys India Pvt Ltd (TDK)."
        })

    elif any(word in user_message for word in [
        "location",
        "where",
        "belongs",
        "live",
        "city",
        "from"
    ]):
        return jsonify({
            "answer":
            "Shrishti is based in Gurgaon, India."
        })

    elif any(word in user_message for word in [
        "btech",
        "graduation",
        "degree",
        "qualification",
        "study"
    ]):
        return jsonify({
            "answer":
            "Shrishti completed BTech in CSE with a specialization in Artificial Intelligence & Machine Learning."
        })

    elif any(word in user_message for word in [
        "skills",
        "tech stack",
        "technology",
        "tools"
    ]):
        return jsonify({
            "answer":
            "Her key skills include Python, Machine Learning, NLP, Flask, Deep Learning, SQL, TensorFlow, OpenCV, Power BI, and AI-driven software development."
        })
        
    elif any(word in user_message for word in [
        "Thanks",
        "thank you",
        "thank you so much",
        "thanks a lot",
        "thank you very much", "Great help", "appreciate it", "grateful", "much appreciated"  
    ]):
        return jsonify({
            "answer":
            "You're welcome! Is there anything else I can help you with?"
        })

    elif any(word in user_message for word in [
        "hobby",
        "hobbies",
        "free time",
        "passion"
    ]):
        return jsonify({
            "answer":
            "Her hobbies include building AI projects, badminton, researching new technologies, exploring intelligent systems, and writing books."
        })

    elif any(word in user_message for word in [
        "projects",
        "best project",
        "featured projects"
    ]):
        return jsonify({
            "answer":
            "Some featured projects include Style Cast AI, AI Astrology Predictor, Weather Forecasting System, Social Media Trend Analyzer, Inventory Demand Forecasting, and Emojify Mood Detection."
        })



    user_embedding = model.encode([user_message])

    similarities = cosine_similarity(
        user_embedding,
        question_embeddings
    )

    best_match_index = np.argmax(similarities)

    best_score = similarities[0][best_match_index]

    print("Question:", user_message)
    print("Score:", best_score)

    if best_score < 0.40:

        return jsonify({
            "answer":
            "I couldn't fully understand that. Try asking about skills, projects, experience, education, hobbies, or contact details."
        })

    answer = knowledge_base[
        best_match_index
    ]["answer"]

    return jsonify({
        "answer": answer
    })
if __name__ == "__main__":

    app.run(debug=True)
