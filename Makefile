#REFERENCE TO GENERATE STATIC PROTOFILES

generate:
	GRPC_TOOLS_NODE_PROTOC \
    --js_out=import_style=commonjs,binary:./server \
    --grpc_out=./server \
    -I . \
    ./protos/*.proto