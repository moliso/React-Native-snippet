import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import axios from 'axios';
import { Ionicons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/Feather';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const apiUrl = Constants.manifest.extra.API_URL;

class FamilyMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            familyMembers: [],
            maxUsers: 0,
            availableUsers: 0
        }
    }

    async getUserId() {
        const token = await AsyncStorage.getItem("token");
        const headers = {
            'Authorization': token.toString()
        }
        axios
            .get(apiUrl + "/familymembers/", { headers: headers })
            .then((res) => {
                this.setState({ familyMembers: res.data.familyMembers })
            })
            .catch((err) => alert("error: " + err));
    }

    async getMaxUsersConnected() {
        const token = await AsyncStorage.getItem("token");
        const headers = {
            'Authorization': token.toString()
        }
        const decodedToken = jwtDecode(token);
        console.log(decodedToken);
        axios
            .get(apiUrl + "/api/v1/" + decodedToken.sub + "/subscription", { headers: headers })
            .then((res) => {
                this.setState({ maxUsers: res.data.maxUsersConnected })
            })
            .catch((err) => alert("error: " + err));
    }

    setAvailableUsers() {
        const familyMembers = this.state.familyMembers;
        const maxUsers = this.state.maxUsers;
        let availableUsers = 0;
        for (familyMember in familyMembers) {
            availableUsers += 1;
        };
        availableUsers = maxUsers - availableUsers;
        this.setState({ availableUsers: availableUsers });
    }

    renderItem = ({ item }) => {
        return (
            <View styles={{ alignContent: "center" }}>
                <TouchableOpacity style={styles.memberButton}>
                    <View style={styles.row}>
                        <Text style={{ flex: 1, textAlign: "left", marginLeft: 10, marginTop: 20, justifyContent: "center" }}>
                            {item.name}
                        </Text>
                        <View style={{ flex: 1, alignItems: "flex-end", marginRight: 10, marginTop: 20 }}>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    componentDidMount() {
        this.getUserId();
        this.getMaxUsersConnected();
        this.setAvailableUsers();
    }

    render() {
        const data = this.state.familyMembers
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.headerButton}
                    onPress={() => this.props.navigation.navigate('Settings')}>
                    <Icon
                        name="chevron-left"
                        size={24}
                    />
                </TouchableOpacity>
                <View>
                    <Text style={styles.titleText}>Użytkownicy</Text>
                </View>
                <View>
                    <FlatList
                        data={data}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={this.renderItem}
                    />
                </View>
                <View style={{ flex: 1, alignItems: "center", backgroundColor: "white" }}>
                    <TouchableOpacity style={styles.memberAddButton}>
                        <Text style={styles.buttonText}>
                            + Dodaj osobę
                            <View style={{ flex: 1, marginLeft: 20, backgroundColor: "#fff", width: 10, borderRadius: 20 }}>
                                <Text style={{ fontSize: 10, textAlign: "center" }}>{this.state.availableUsers}</Text>
                            </View>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    }
}

export default FamilyMembers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: StatusBar.currentHeight,
        alignContent: "center"
    },

    row: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
    },

    headerButton: {
        marginLeft: 15,
        marginTop: 20,
    },

    titleText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center"
    },

    memberText: {
        fontSize: 16,
        color: "#808080",
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
        textAlign: "left"
    },

    memberButton: {
        borderRadius: 20,
        height: 60,
        margin: 10,
        backgroundColor: "white",
        elevation: 2,
    },

    memberAddButton: {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: "black",
        borderRadius: 25,
        width: 300,
        height: 50,
        marginBottom: 20,
        marginTop: 20
    },

    buttonText: {
        fontSize: 16,
        color: "white",
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 10
    }
}
)