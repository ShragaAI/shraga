import json
from datetime import datetime

from opensearchpy import OpenSearch, helpers

from shraga_common import ShragaConfig


class IngestUtils:

    @staticmethod
    def create_index(client, index):
        if client.indices.exists(index=index):
            doc_count = client.count(index=index).get("count")
            print(f"index {index} already exists, contains {doc_count} docs.")
        else:
            print(f"Creating index {index}...")
            client.indices.create(index=index)
            print(f"Index {index} created.")

    @staticmethod
    def create_index_template(client, template_name, template_body):
        if client.indices.exists_template(template_name):
            print(f"Template {template_name} already exists. Updating template...")
            client.indices.put_index_template(name=template_name, body=template_body)
            print(f"Template {template_name} updated.")
        else:
            print(f"Creating template {template_name}...")
            client.indices.put_index_template(name=template_name, body=template_body)
            print(f"Template {template_name} created.")

    @staticmethod
    def create_component_template(client, template_name, template_body):
        if client.indices.exists_template(template_name):
            print(
                f"Component template {template_name} already exists. Updating template..."
            )
            client.cluster.put_component_template(
                name=template_name, body=template_body
            )
            print(f"Component template {template_name} updated.")
        else:
            print(f"Creating component template {template_name}...")
            client.cluster.put_component_template(
                name=template_name, body=template_body
            )
            print(f"Component template {template_name} created.")

    @staticmethod
    def get_client(shraga_config: ShragaConfig):
        opens = shraga_config.get("retrievers.opensearch")
        host = opens.get("host")
        port = opens.get("port")
        auth = (opens.get("user"), opens.get("password"))
        index = opens.get("index")
        verify_certs = opens.get("verify_certs")
        print(f"Connecting to {host}:{port}/{index}...")
        return OpenSearch(
            hosts=[{"host": host, "port": port}],
            http_compress=True,  # enables gzip compression for request bodies
            http_auth=auth,
            use_ssl=True,
            verify_certs=verify_certs,
        )

    @staticmethod
    def get_client_elasticsearch(shraga_config: ShragaConfig):
        opens = shraga_config.get("retrievers.elasticsearch")
        host = opens.get("host")
        port = opens.get("port")
        auth = (opens.get("user"), opens.get("password"))
        index = opens.get("index")
        verify_certs = opens.get("verify_certs")
        use_ssl = opens.get("use_ssl")
        print(f"Connecting to {host}:{port}/{index}...")
        return OpenSearch(
            hosts=[{"host": host, "port": port}],
            http_compress=True,  # enables gzip compression for request bodies
            http_auth=auth,
            use_ssl=use_ssl,
            verify_certs=verify_certs,
        )

    @staticmethod
    def ingest(client, docs):
        succeeded = []
        failed = []

        for success, item in helpers.parallel_bulk(
            client,
            docs,
            max_chunk_bytes=1 * 1024 * 1024,
            request_timeout=30,
            raise_on_error=False,
        ):
            if success:
                succeeded.append(item)
                if len(succeeded) % 5000 == 0:
                    print(f"Bulk-inserted {len(succeeded)} items (bulk).")
            else:
                failed.append(item)

        if len(failed) > 0:
            print(f"There were {len(failed)} errors:")
            timestamp = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
            with open(f"failed-{timestamp}.json", "w", encoding="utf-8-sig") as f:
                for item in failed:
                    f.write(json.dumps(item) + "\n")
        if len(succeeded) > 0:
            print(f"Bulk-inserted {len(succeeded)} items (parallel_bulk).")

    @staticmethod
    def read_json_from_gzip_file(f):
        for line in f:
            line = line.decode(encoding="UTF-8")
            yield json.loads(line)

    @staticmethod
    def count_docs(data_provider):
        count = 0
        count_by_id = {}
        for item in data_provider:
            count += 1

            item_id = item["system_id"] if "system_id" in item else "unknown"
            if item_id not in count_by_id:
                count_by_id[item_id] = 0
            count_by_id[item_id] += 1

            if count_by_id[item_id] > 1:
                print(f"Item {item_id} appears {count_by_id[item_id]} times.")

            if count % 10000 == 0:
                print(f"Processed {count} items.")

        print("Total:", count)
        for k, v in count_by_id.items():
            if v > 1:
                print(f"{k}: {v}")
        return count, count_by_id
