import database from '@react-native-firebase/database';

class Country{
    toCountry = '/countries';
    toStates = '/countries';
    toCity = '/cities';
}

Country.getStates = async (country) => {
    let snapshot;
    try {
        snapshot = await database().ref('/countries/countries').orderByChild('country').equalTo(country).once('value')
    } catch(err) {
    }

    if(!snapshot.val()) return ["Others"]

    let data = undefined

    snapshot.forEach(val => {
        if(val.val() && val.val()["states"]){
            data = val.val()["states"]
        }
    })


    return data ? data : ["Others"]
}

Country.getCities = async (state) => {
    let snapshot;
    try {
        snapshot = await database().ref('/cities').orderByChild('state').equalTo(state).once('value');
    } catch (error) {
    }

    const data = snapshot.val()
    
    if(!data) return ["Others"]
    if(data.length == 0) return ["Others"]
    
    let c = Object.values(data).map( item => item.city)
    return c
}

export default Country;