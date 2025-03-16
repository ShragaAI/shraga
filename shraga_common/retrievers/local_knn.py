import gzip
import json
from pathlib import Path
from typing import Dict, List, Optional

import faiss
import numpy

from .base_search_retriever import BaseSearchRetriever


class LocalKnnRetriever(BaseSearchRetriever):
    """
    FaissRetriever class for querying vectors using cosine similarity with Faiss.
    Supports exact and approximate nearest neighbor (ANN) search.
    """

    def __init__(self, nlist: int = 100, nprobe: int = 10):
        self.index = None
        self.index_ivf = None
        self.vectors = []
        self.jsons = []
        self.nlist = nlist
        self.nprobe = nprobe

    def load_data(self, folder_path: str, vector_field: str):
        """
        Load vector data from JSONL.GZ files in a specified folder.

        Args:
            folder_path (str): Path to the folder containing JSONL.GZ files.
            vector_field (str): The key in the JSON containing vector data.
        """
        files = Path(folder_path).glob("*.jsonl.gz")
        for file in files:
            with gzip.open(file, "rt", encoding="utf-8") as f:
                for line in f:
                    json_line = json.loads(line.strip())
                    if vector_field in json_line:
                        vector = json_line[vector_field]
                        self.vectors.append(vector)
                        self.jsons.append(json_line)

        if self.vectors:
            vectors_array = faiss.vector_to_array(self.vectors)
            dim = len(self.vectors[0])
            self.normalize_vectors(vectors_array, dim)

            self.index = faiss.IndexFlatIP(dim)
            quantizer = faiss.IndexFlatIP(dim)
            self.index_ivf = faiss.IndexIVFFlat(quantizer, dim, self.nlist)
            self.index_ivf.train(vectors_array)
            self.index_ivf.add(vectors_array)
            self.index.add(vectors_array)

    def normalize_vectors(self, vectors_array, dim):
        """Normalize vectors to unit length for cosine similarity computation"""
        faiss.normalize_L2(vectors_array.reshape(-1, dim))

    def knn_search(
        self, query_vector: List[float], top_k: int, use_ann: Optional[bool] = False
    ) -> List[Dict]:
        """
        Perform KNN search.

        Args:
            query_vector (List[float]): Query vector for searching.
            top_k (int): Number of top results to return.
            use_ann (Optional[bool]): If True, use ANN search; otherwise, use exact search.

        Returns:
            List[Dict]: List of matching json objects.
        """
        dim = len(query_vector)
        faiss.normalize_L2(numpy.array(query_vector))

        if use_ann:
            assert self.index_ivf.is_trained, "IVF index not trained."
            self.index_ivf.nprobe = self.nprobe
            distances, indices = self.index_ivf.search(
                numpy.array([query_vector]), top_k
            )
        else:
            distances, indices = self.index.search(numpy.array([query_vector]), top_k)

        return [self.jsons[i] for i in indices[0] if i != -1]


# Usage
# knn_retriever = LocalKnnRetriever()
# knn_retriever.load_data("path_to_data_folder", "vector_field_name")
# results = knn_retriever.knn_search(query_vector=[0.1, 0.2, 0.3], top_k=5, use_ann=True)
