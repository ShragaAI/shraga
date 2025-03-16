EXECUTION_PLAN_PROMPT = """
Generate an execution plan to answer the given question using the available tools.
Adjust tool parameters for each tool, based on the history and the description.

Return the response according to the following format (List of dicts). You must not add any additional text:
<format>
```json
{{
    "plan": [
    {{
        "tool": str,
        "parameters": dict,
        "reasoning": "Include the reasoning for choosing the tool"
    }}, ...
    ]
}}
]
```
</format>

This is the chat history. Use it to adjust each tool:
<chat_history>
{formatted_history}
</chat_history>

Question: {question}
"""
