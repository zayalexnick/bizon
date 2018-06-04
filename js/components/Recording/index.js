import React, { Component } from 'react';
import { View, ScrollView, Text, StatusBar, ActivityIndicator, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import * as actions from './actions';

class Recording extends Component
{
    static navigationOptions = ({ navigation }) => ({
        title: 'Просмотр записи'
    });

    componentDidMount()
    {
        const { id } = this.props.navigation.state.params;
        this.props.getRecord(id);
        console.log(this.props.record.services);
    }

    renderAuto = () => {
        const { auto } = this.props.record;

        return (
            <View style={styles.auto.container}>
                <Image style={styles.auto.image} source={require('../../../img/default_auto.png')}/>
                <Text style={styles.auto.title}>{auto.make} {auto.model}</Text>
            </View>
        );
    };

    render()
    {
        const { record } = this.props;
        if (record.loading) return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <StatusBar hidden={true}/>
                <ActivityIndicator size={70}/>
            </View>
        );

        return (
            <View style={{ flex: 1 }}>
                <View style={{elevation:4,backgroundColor:'crimson', height:60,flexDirection: 'row'}}>
                    <TouchableOpacity
                        style={{width:60,alignItems: 'center',justifyContent:'center',height:60,}}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Icon name='md-arrow-back' style={{color: 'white'}}/>
                    </TouchableOpacity>

                    <View style={{flex:1,justifyContent:'center'}}>
                        <Text style={{color:'white',textAlign:'center', fontWeight:'bold', fontSize:20}}>{'Просмотр записи'.toUpperCase()}</Text>
                    </View>
                    <View style={{width: 60}}>

                    </View>
                </View>
                {this.renderAuto()}
                <ScrollView>
                    <View style={styles.record.date}>
                        <Text style={styles.record.label}>Дата записи:</Text>
                        <Text style={styles.record.value}>{ record.record.date }</Text>
                    </View>
                    <View style={styles.services.container}>
                        <Text style={styles.services.title}>Перечень услуг:</Text>
                        <View style={styles.service.container}>
                            { record.services.map((service, index) => (
                                <Text key={index} style={styles.service.text}>{service}</Text>
                            )) }
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = {
    auto: {
        container: {
            position: 'relative',
            flexDirection: 'column',
            borderBottomColor: 'red',
            borderBottomWidth: 1,
            height: 250,
            paddingBottom: 50,
            backgroundColor: '#fff'
        },
        image: {
            width: Dimensions.width
        },
        title: {
            position: 'absolute',
            bottom: 15,
            left: 15,
            zIndex: 2,
            fontSize: 20,
            fontWeight: 'bold'
        }
    },
    record: {
        date: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 15,
            paddingVertical: 30,
            marginBottom: 30,
            borderBottomColor: '#aaaaaa',
            borderBottomWidth: 1,
        },
        label: {
            fontSize: 16,
            fontWeight: 'bold'
        },
        value: {
            fontSize: 16
        }
    },
    services: {
        container: {
            flex: 1,
            flexDirection: 'row',
            paddingHorizontal: 15,
            marginBottom: 30
        },
        title: {
            flex: 1,
            fontSize: 16,
            fontWeight: 'bold'
        }
    },
    service: {
        container: {
            flex: 1
        },
        text: {
            fontSize: 16,
            marginBottom: 10,
            lineHeight: 24
        }
    }
};

const mapStateToProps = (state) => ({
    record: state.record
});

const mapDispatchToProps = (dispatch) => ({
    getRecord: (id) => dispatch(actions.getRecord(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Recording);