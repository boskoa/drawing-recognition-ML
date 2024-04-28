from sklearn.neural_network import MLPClassifier
import json

classes = {
    "car": 0,
    "fish": 1,
    "house": 2,
    "tree": 3,
    "bicycle": 4,
    "guitar": 5,
    "pencil": 6,
    "clock": 7,
}


def read_feature_file(file_path):
    X = []
    y = []

    with open(file_path) as f:
        lines = f.readlines()
        for i in range(1, len(lines)):
            row = lines[i].split(",")
            X.append([float(row[j]) for j in range(len(row) - 1)])
            y.append(classes[row[-1].strip()])

    return (X, y)


hidden = 10
mlp = MLPClassifier(hidden, max_iter=10000, random_state=2, activation="tanh")

X, y = read_feature_file("../data/dataset/training.csv")

mlp.fit(X, y)

X, y = read_feature_file("../data/dataset/testing.csv")

accuracy = mlp.score(X, y)

print("Accuracy: ", accuracy)

json_obj = {
    "neuronCounts": [len(X[0]), hidden, len(classes)],
    "classes": list(classes.keys()),
    "network": {"levels": []},
}

for i in range(0, len(mlp.coefs_)):
    level = {
        "weights": mlp.coefs_[i].tolist(),
        "biases": mlp.intercepts_[i].tolist(),
        "inputs": [0] * len(mlp.coefs_[i]),
        "outputs": [0] * len(mlp.intercepts_[i]),
    }

    json_obj["network"]["levels"].append(level)

json_object = json.dumps(json_obj, indent=2)

with open("../data/dataset/model.json", "w") as outfile:
    outfile.write(json_object)

with open("../common/js_objects/model.js", "w") as outfile:
    outfile.write("const model = " + json_object + ";")
