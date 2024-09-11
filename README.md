# ETH JSON-RPC
예를 들어 provider.send("eth_geaPrice",[])로 JSON-RPC 직접 호출 시
가스 가격은 16진수 문자열 형식으로 호출됨

BigInt() 사용해서 16진수 문자열을 정수로 변환

# Getting Started

Web3는 Provider가 read와 write 까지 모두 제공
Ethers는 read는 Provider, write는 signer가 제공 

