from sklearn.neighbors import KNeighborsClassifier

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
            y.append(row[-1].strip())

    return (X, y)


knn = KNeighborsClassifier(n_neighbors=5, algorithm="brute", weights="uniform")

X, y = read_feature_file("../data/dataset/training.csv")

knn.fit(X, y)

X, y = read_feature_file("../data/dataset/testing.csv")

accuracy = knn.score(X, y)

print("Accuracy: ", accuracy)
