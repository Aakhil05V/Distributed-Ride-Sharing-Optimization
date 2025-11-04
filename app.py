from flask import Flask, render_template, request, jsonify
import nltk
from nltk import CFG, ChartParser

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/check", methods=["POST"])
def check_ambiguity():
    data = request.get_json()
    grammar_text = data.get("grammar", "")
    test_string = data.get("test_string", "")
    response = {}
    try:
        grammar = CFG.fromstring(grammar_text)
        parser = ChartParser(grammar)
        tokens = test_string.strip().split()
        parse_trees = list(parser.parse(tokens))
        count = len(parse_trees)
        if count == 0:
            response["parse_tree_count"] = 0
            response["message"] = "Input string cannot be parsed by this grammar."
        elif count == 1:
            response["parse_tree_count"] = 1
            response["message"] = "Grammar is unambiguous for this input."
        else:
            response["parse_tree_count"] = count
            response["message"] = "Grammar is ambiguous for this input."
    except Exception as e:
        response["parse_tree_count"] = 0
        response["message"] = f"Error: {str(e).splitlines()[0]}"
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
