import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { FC, useEffect, useState } from "react";

const SEPOLIA_PROVIDER_URL = 'https://sepolia.infura.io/v3/d1ac03c74048425a9dc53f70360cf841';

const Home: FC = () => {
  const [wallet, setWallet] = useState<ethers.Wallet | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [txHash, setTxHash] = useState<string | null>(null);

  // 새로운 지갑 생성 (비밀키, 공개키 생성)
  const createWallet = (): void => {
    const newWallet = ethers.Wallet.createRandom();
    const provider = new ethers.JsonRpcProvider(SEPOLIA_PROVIDER_URL);
    const walletWithProvider = newWallet.connect(provider);
    setWallet(walletWithProvider as unknown as ethers.Wallet); // 이부분 walletWithProvider는 HDNodeWallet이고 ethers.Wallet은 Wallet 타입 walletWithProvider가 서브 객체 이 코드 문제 생길 수 있는지 ?
    localStorage.setItem('privateKey', newWallet.privateKey);
    console.log('New Wallet Address:', newWallet.address);
  };

  // 네트워크에서 잔액 조회
  const getBalance = async (): Promise<void> => {
    if (wallet) {
      try {
        const provider = new ethers.JsonRpcProvider(SEPOLIA_PROVIDER_URL); // Sepolia 프로바이더 설정
        const balance = await provider.getBalance(wallet.address);
        setBalance(ethers.formatEther(balance)); // 잔액을 Ether로 변환
      } catch (error) {
        console.error('Failed to get balance', error);
      }
    }
  };

  // 트랜잭션 서명 및 전송
  const sendTransaction = async (): Promise<void> => {
    if (wallet && recipient && amount) {
      try {
        const provider = ethers.getDefaultProvider(); // 이더리움 네트워크 제공자
        const walletWithProvider = wallet.connect(provider); // 네트워크와 연결된 지갑
        const tx = {
          to: recipient,
          value: ethers.parseEther(amount), // 송금할 Ether 양
          gasLimit: 21000, // 기본 가스 한도
          gasPrice: ethers.parseUnits('10', 'gwei'), // 기본 가스 가격
        };
        const transaction = await walletWithProvider.sendTransaction(tx); // 트랜잭션 전송
        setTxHash(transaction.hash); // 트랜잭션 해시 저장
        console.log('Transaction Hash:', transaction.hash);
      } catch (error) {
        console.error('Transaction failed', error);
      }
    }
  };

  useEffect(() => {
    const storedPrivateKey = localStorage.getItem('privateKey');
    if (storedPrivateKey) {
      const wallet = new ethers.Wallet(storedPrivateKey);
      const provider = new ethers.JsonRpcProvider(SEPOLIA_PROVIDER_URL);
      setWallet(wallet.connect(provider));
    }
  }, []);

  return (
    <Flex direction="column" p={5} gap={4}>
      <Flex mb={4} fontSize="2xl">
        My Custom Crypto Wallet
      </Flex>
      {wallet ? (
        <Flex direction="column" gap={4}>
          <Text>Wallet Address: {wallet.address}</Text>
          <Text>Private Key: {wallet.privateKey}</Text>

          <Button onClick={getBalance} colorScheme="teal">
            Get Balance
          </Button>

          {balance && (
            <Text>Balance: {balance} ETH</Text>
          )}

          <Flex direction="column" gap={4} mt={4}>
            <Text fontSize="lg">Send Transaction</Text>
            <Input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Amount in ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button onClick={sendTransaction} colorScheme="teal">
              Send
            </Button>
            {txHash && (
              <Text>Transaction Hash: {txHash}</Text>
            )}
          </Flex>
        </Flex>
      ) : (
        <Button onClick={createWallet} colorScheme="teal">
          Create New Wallet
        </Button>
      )}
    </Flex>
  );
};

export default Home;
