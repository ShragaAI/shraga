import gzip
import json
import os
import zipfile
from json import JSONDecodeError
from typing import Literal


class LocalRetriever:

    @staticmethod
    def get_data_from_folder(
        path: str,
        verbose: bool = False,
        encoding_method: str = "utf8",
        file_type: Literal["json", "zip"] = "json",
    ):
        """
        Get json data from each file in a folder.

        Args:
            path (str): Folder's full path.
            verbose (bool): Add prints.
            file_type (json \\ zip): Type of files to load.

        Returns:
            dict: Parsed json data by relevant keys.
        """

        if not os.path.exists(path) or not os.path.isdir(path):
            raise ValueError(f"Invalid folder path: {path}")

        for file_name in os.listdir(path):
            print("Loading file", file_name)
            if file_name.endswith(f".{file_type}"):
                file_path = os.path.join(path, file_name)

                if file_type == "json":
                    yield from LocalRetriever.get_data_from_json_file(
                        file_path, verbose=verbose, encoding_method=encoding_method
                    )
                elif file_type == "zip":
                    yield from LocalRetriever.get_data_from_zip(
                        file_path, verbose=verbose, encoding_method=encoding_method
                    )

    @staticmethod
    def get_data_from_zip(
        zip_path: str, verbose: bool = False, encoding_method: str = "utf8"
    ):
        archive = zipfile.ZipFile(zip_path, "r")
        for name in archive.namelist():
            if name.endswith(".json") and not name.startswith("__MACOSX"):
                if verbose:
                    print("Loading file", name)
                with archive.open(name) as f:
                    try:
                        content = json.load(f)
                        if isinstance(content, list):
                            for item in content:
                                yield item
                        else:
                            yield content
                    except JSONDecodeError:
                        print(f"Error loading {name} - JSONDecodeError")

    @staticmethod
    def get_data_from_gz(
        gz_path: str, verbose: bool = False, encoding_method: str = "utf8"
    ):
        with gzip.open(gz_path, "rt", encoding=encoding_method) as f:
            if verbose:
                print(f"Loading file {gz_path}")
            try:
                for line in f:
                    yield json.loads(line)
            except JSONDecodeError:
                print(f"Error loading {gz_path} - JSONDecodeError")

    @staticmethod
    def get_data_from_json_file(
        file_path: str, verbose: bool = False, encoding_method: str = "utf8"
    ):
        with open(file_path, "r", encoding=encoding_method) as f:
            if verbose:
                print(f"Loading file {file_path}")
            try:
                content = json.load(f)
                yield content
            except JSONDecodeError:
                print(f"Error loading {file_path} - JSONDecode")

    @staticmethod
    def get_data_from_folders(path: str, verbose: bool = True):
        """
        Get json data from each file within a folder of folders.

        Args:
            path (str): Folder's full path.
            verbose (bool): Add prints.

        Returns:
            dict: Parsed json data by relevant keys.
        """
        # Only folders
        for sub_folder in [
            f_name for f_name in os.listdir(path) if not f_name.startswith(".")
        ]:
            if verbose:
                print(sub_folder)
            yield LocalRetriever.get_data_from_folder("/".join([path, sub_folder]))
