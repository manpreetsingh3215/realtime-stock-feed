import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

interface StockData {
    symbol: string;
    name?: string;
    industry?: string;
    price: number;
    timestamp: string;
}

export default function App() {
    const [stocks, setStocks] = useState<StockData[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // Mockly.me WebSocket connection
        const connectWebSocket = () => {
            try {
                setConnectionStatus('connecting');
                console.log("Connecting to Mockly.me WebSocket...");

                // Generate unique client ID
                const clientId = `expo-client-${Date.now()}`;
                const ws = new WebSocket(`wss://mockly.me/ws/stream/${clientId}`);
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log('WebSocket connected to Mockly.me');
                    setConnectionStatus('connected');

                    // Send configuration for real-time updates
                    const config = {
                        frequency: 1.0,    // Update every 1 second
                        volatility: 0.02   // 2% price volatility
                    };

                    ws.send(JSON.stringify(config));
                    console.log('Sent configuration:', config);
                };

                ws.onmessage = (event) => {
                    try {
                        const message = JSON.parse(event.data);
                        console.log("message>>>>>>>", message)
                        console.log('Received message:', message.type);

                        switch (message.type) {
                            case 'stock_info':
                                // Initial stock information
                                const stockInfo: StockData = {
                                    symbol: message.symbol,
                                    name: message.name,
                                    industry: message.industry,
                                    price: 0,
                                    timestamp: message.timestamp
                                };

                                setStocks(prev => {
                                    const existing = prev.find(stock => stock.symbol === message.symbol);
                                    if (!existing) {
                                        return [...prev, stockInfo];
                                    }
                                    return prev.map(stock =>
                                        stock.symbol === message.symbol
                                            ? { ...stock, name: message.name, industry: message.industry }
                                            : stock
                                    );
                                });
                                break;

                            case 'price_update':
                                // Real-time price updates
                                setStocks(prev => {
                                    const updated = prev.map(stock => {
                                        if (stock.symbol === message.symbol) {
                                            return {
                                                ...stock,
                                                price: message.price,
                                                timestamp: message.timestamp
                                            };
                                        }
                                        return stock;
                                    });

                                    // If stock doesn't exist, create it
                                    if (!updated.find(stock => stock.symbol === message.symbol)) {
                                        updated.push({
                                            symbol: message.symbol,
                                            price: message.price,
                                            timestamp: message.timestamp
                                        });
                                    }

                                    return updated.slice(0, 10); // Keep only latest 10 stocks
                                });
                                break;

                            default:
                                console.log('Unknown message type:', message.type);
                        }
                    } catch (err) {
                        console.error("Error parsing WebSocket message:", err);
                    }
                };

                ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    setConnectionStatus('error');
                };

                ws.onclose = (event) => {
                    console.log('🔌 WebSocket disconnected:', event.code, event.reason);
                    setConnectionStatus('disconnected');

                    // Attempt to reconnect after 5 seconds
                    if (event.code !== 1000) {
                        setTimeout(() => {
                            console.log('Attempting to reconnect...');
                            connectWebSocket();
                        }, 5000);
                    }
                };

            } catch (error) {
                console.error('Failed to connect to WebSocket:', error);
                setConnectionStatus('error');
                Alert.alert('Connection Error', 'Failed to connect to stock feed. Please check your internet connection.');
            }
        };

        connectWebSocket();

        return () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close(1000, 'Component unmounting');
            }
        };
    }, []);

    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return '#4CAF50';
            case 'connecting': return '#FF9800';
            case 'error': return '#F44336';
            default: return '#9E9E9E';
        }
    };

    const getStatusText = () => {
        switch (connectionStatus) {
            case 'connected': return 'Connected';
            case 'connecting': return 'Connecting...';
            case 'error': return 'Connection Error';
            default: return 'Disconnected';
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Live Stock Feed</Text>
                <Text style={[styles.status, { color: getStatusColor() }]}>
                    {getStatusText()}
                </Text>
            </View>

            <FlatList
                data={stocks}
                keyExtractor={(item) => item.symbol}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.symbol}>{item.symbol}</Text>
                            <Text style={styles.time}>
                                {new Date(item.timestamp).toLocaleTimeString()}
                            </Text>
                        </View>
                        {item.name && (
                            <Text style={styles.stockName}>{item.name}</Text>
                        )}
                        {item.industry && (
                            <Text style={styles.industry}>{item.industry}</Text>
                        )}
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>
                                ${item.price?.toFixed(2) || 'N/A'}
                            </Text>
                        </View>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                style={styles.list}
            />

            {stocks.length === 0 && connectionStatus === 'connected' && (
                <Text style={styles.waitingText}>
                    Waiting for live stock updates...
                </Text>
            )}

            {connectionStatus === 'error' && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        Connection failed. Please check your internet connection.
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginHorizontal: 20

    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1a1a1a"
    },
    status: {
        fontSize: 14,
        fontWeight: "600",
    },
    list: {
        flex: 1,
    },
    card: {
        padding: 16,
        marginVertical: 8,
        borderRadius: 12,
        backgroundColor: "#ffffff",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    symbol: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1a1a1a"
    },
    time: {
        fontSize: 12,
        color: "#666",
        fontWeight: "500"
    },
    stockName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 4,
    },
    industry: {
        fontSize: 14,
        color: "#666",
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1a1a1a"
    },
    waitingText: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
        color: "#666",
        fontStyle: "italic"
    },
    errorContainer: {
        margin: 20,
        padding: 16,
        backgroundColor: "#ffebee",
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#F44336",
    },
    errorText: {
        color: "#c62828",
        fontSize: 14,
        textAlign: "center",
    },
});
