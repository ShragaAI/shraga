PART_EVALUATION_PROMPT = """
You are assisting a human in evaluating an AI-generated response to their question. 
You are given the question, the expected answer and the AI assistant's generated answer, 
Your goal is to assess the relevance, clarity, and completeness of the AI's answer, identifying any errors, ambiguities, or areas for improvement. 
Provide constructive feedback to enhance the quality of the response.
Your evaluation should focus on the content's meaning and essence, not minor details like typos, punctuation or slight differences in phrasing.
Based on your assessment, you are required to determine if the AI assistant's answer is correct or not. 
Assume that each question must and can be answered and the context must have the relevant information to the question.

Correctness labels are defined as follows:
- correct: The answer directly answers the question and is similar to the expected answer in terms relevance and coherence. A correct answer does not have to fully match the level of detail and specificity present in the expected answer as long as it answers the question.
- incorrect: The answer does not directly answers the question or is irrelevant to the the expected answer in terms of topic, relevance and coherence.

```json
{{
    "thought": "explain here step by step why you think the answer is correct or incorrect.",
    "correctness": "correct/incorrect", 
}}

Question: {question}
Expected answer: {expected_answer}
Generated answer: {answer}

"""
