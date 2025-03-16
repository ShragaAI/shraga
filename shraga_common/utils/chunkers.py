import math
from typing import List, Optional, TypedDict


class ChunkOptions(TypedDict):
    verbose: Optional[bool]
    trail: Optional[str]


class BasicChunker:

    def __init__(
        self, block_size: Optional[int] = 2000, min_chunk_size: Optional[int] = 0
    ):
        self.min_chunk_size = min_chunk_size
        self.block_size = block_size

    def split_documents_by_chunk_size(self, text: str) -> List[str]:
        """
        Given text, divides it to balanced chunks where chunk size is between block size and min block size
        """
        cur_min_chunk_size = self.min_chunk_size
        # Case where the given min_chunk_size is bigger that the length of the text. In this case the min_chunk_size is determined as the length of the text.
        if self.min_chunk_size > len(text):
            cur_min_chunk_size = len(text)

        # Create indices that split the text into block sizes which are larger than min_chunk_size and smaller than block_size by assuring minimum number of total chunks.
        text_chunk_size = math.ceil(len(text) / self.block_size)
        avg_chunk_size = math.ceil(len(text) / text_chunk_size)
        indices = [avg_chunk_size] * (text_chunk_size - 1) + [
            len(text) - avg_chunk_size * (text_chunk_size - 1)
        ]

        # Checks if the block_size is a vaild value as a function of min_chunk_size parameter
        total_text_length = len(text)
        required_sum = cur_min_chunk_size * len(indices)
        num_chunks = len(indices)

        if sum(indices) < required_sum:
            raise ValueError("invalid min_block_size value")

        else:

            # Adjust the size of each chunk to make sure they are uniform.
            adjusted_chunk_sizes = [cur_min_chunk_size] * num_chunks
            remaining_sum = total_text_length - required_sum

            extra_per_element = remaining_sum // num_chunks
            remainder = remaining_sum % num_chunks

            for i in range(num_chunks):
                adjusted_chunk_sizes[i] += extra_per_element
                if i < remainder:
                    adjusted_chunk_sizes[i] += 1

            # Split the text into chunks based on adjusted sizes, ensuring splits occur at whitespaces.
            chunks = []
            start_idx = 0

            for size in adjusted_chunk_sizes:
                end_idx = start_idx + size
                if end_idx < len(text):
                    # Ensure we do not cut words by finding the nearest whitespace before or after end_idx.
                    while end_idx > start_idx and text[end_idx - 1] not in " \t\n":
                        end_idx -= 1
                    # If no whitespace found before, extend to the next whitespace after the block.
                    if end_idx == start_idx:
                        while end_idx < len(text) and text[end_idx] not in " \t\n":
                            end_idx += 1
                            if end_idx - start_idx + 1 == self.block_size:
                                break

                chunks.append(text[start_idx:end_idx])
                start_idx = end_idx

        return chunks

    def split_documents_by_paragraphs(self, parags: List[str]) -> List[str]:
        """
        Concatenating paragraphs by making sure their length is not longer than block_size
        """
        allowed_percentage = 0.2
        parag_chunks = []
        cur_par = parags[0]
        for par in parags[1:]:
            # Allowing joint chunk size an offset of allowed_percentage. Make sure the first paragraph is not relatively short (less than the allowed percentage)
            if len(cur_par) + len(par) > self.block_size * (1 + allowed_percentage):
                parag_chunks.append(cur_par)
                cur_par = par

            else:
                cur_par += par
        # Checking if the last paragraph's size is less than the allowed percentage of block size. Make sure the last chunk is not very short.
        if len(cur_par) < self.block_size * allowed_percentage:
            if len(parag_chunks) == 0:
                parag_chunks.append("")
            parag_chunks[-1] += " " + cur_par

        else:
            parag_chunks.append(cur_par)

        return parag_chunks

    def chunk(self, text: str, extra: Optional[ChunkOptions] = None) -> List[str]:
        verbose = (extra or {}).get("verbose", False)

        if verbose:
            print("Chunking text with BasicChunker")
        return text.split("\n")
