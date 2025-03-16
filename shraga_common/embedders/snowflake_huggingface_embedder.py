import json
import logging
import os
from typing import Dict, List, Optional

import snowflake.connector
from sentence_transformers import SentenceTransformer

from shraga_common import ShragaConfig

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class SnowflakeHuggingfaceEmbedder:
    def __init__(
        self,
        shraga_config: Optional[ShragaConfig] = None,
        user: Optional[str] = None,
        password: Optional[str] = None,
        account: Optional[str] = None,
        warehouse: Optional[str] = None,
        database: Optional[str] = None,
        schema: Optional[str] = None,
        model_name_or_path: Optional[str] = "all-MiniLM-L6-v2",
    ):

        # Initialize Snowflake connection
        snowflake_configs: Dict = (
            shraga_config.get("embedders.snowflake_huggingface")
            if shraga_config
            else {}
        )

        if snowflake_configs:
            user = user or snowflake_configs.get("user")
            password = password or snowflake_configs.get("password")
            account = account or snowflake_configs.get("account")
            warehouse = warehouse or snowflake_configs.get("warehouse")
            database = database or snowflake_configs.get("database")
            schema = schema or snowflake_configs.get("schema")

        self.snowflake_client = snowflake.connector.connect(
            user=user,
            password=password,
            account=account,
            warehouse=warehouse,
            database=database,
            schema=schema,
        )

        # Load a SentenceTransformer model (appropriate for sentence embeddings)
        self.model = SentenceTransformer(model_name_or_path)

    def fetch_data(self, query: str) -> List[str]:
        """Fetch text data from Snowflake."""
        try:
            with self.snowflake_client.cursor() as cur:
                cur.execute(query)
                results = cur.fetchall()
                return [row[0] for row in results]
        except snowflake.connector.Error as e:
            logger.error(f"Snowflake error occurred: {e}")
            raise

    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts using a Hugging Face model."""
        try:
            embeddings = self.model.encode(texts)
            return embeddings.tolist()
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            raise

    def store_embeddings(
        self, texts: List[str], embeddings: List[List[float]], table: str
    ):
        """Store embeddings back into Snowflake."""
        try:
            with self.snowflake_client.cursor() as cur:
                for text, embedding in zip(texts, embeddings):
                    embedding_json = json.dumps(embedding)
                    cur.execute(
                        f"INSERT INTO {table} (text_column, embedding_column) VALUES (%s, %s::VARIANT)",
                        (text, embedding_json),
                    )
                self.snowflake_client.commit()
        except snowflake.connector.Error as e:
            logger.error(f"Error storing embeddings in Snowflake: {e}")
            raise

    def process_and_store(self, fetch_query: str, dest_table: str):
        """Fetch data from Snowflake, generate embeddings, and store them back."""
        try:
            # Fetch data
            data_list = self.fetch_data(fetch_query)
            logger.info(f"Fetched {len(data_list)} records from Snowflake.")

            # Generate embeddings
            embeddings_list = self.generate_embeddings(data_list)

            # Store embeddings back into Snowflake
            self.store_embeddings(data_list, embeddings_list, dest_table)
            logger.info(
                f"Stored {len(embeddings_list)} embeddings back into Snowflake."
            )
        except Exception as e:
            logger.error(f"An unexpected error occurred: {e}")
            raise


# Example usage
# if __name__ == "__main__":
#    embedder = SnowflakeHuggingfaceEmbedder()
#
#    try:
#        fetch_query = "SELECT text_column FROM your_source_table"
#        dest_table = "your_table_with_embeddings"
#        embedder.process_and_store(fetch_query, dest_table)
#    except Exception as e:
#        logger.error(f"Error in processing and storing embeddings: {e}")
