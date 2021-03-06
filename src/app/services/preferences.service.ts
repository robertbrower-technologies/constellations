import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '../components/preferences/preferences.component';
import { getZodiacSign } from '../helpers/get-zodiac-sign';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

    preferences: BehaviorSubject<Partial<Preferences>>;
    
    constructor() {
        let birthday = (new Date()).toISOString();
        this.preferences = new BehaviorSubject<Partial<Preferences>>(
            // {
            //     birthday: birthday,
            //     communication: 0,
            //     compatibility: 0,
            //     screenName: getZodiacSign(birthday),
            //     showPhotoInSearchResults: false,
            //     sex: 0
            // }
            null
        );
        
    }

    public getScreenName(uid: string): string {
        let _birthday = this.getBirthday(uid);
        let _screenName = localStorage.getItem(`${uid} screenName`);
        let screenName = _screenName ? _screenName : getZodiacSign(_birthday);
        return screenName;
    }

    public getBirthday(uid: string): string {
        let _birthday = localStorage.getItem(`${uid} birthday`);
        let birthday = _birthday ? _birthday : (new Date()).toISOString();
        return birthday;
    }

    public getComunication(uid: string): number {
        let _communication = localStorage.getItem(`${uid} communication`);
        let communication = _communication ? parseInt(_communication) : 0;
        return communication;
    }

    public getCompatibility(uid: string): number {
        let _compatibility = localStorage.getItem(`${uid} compatibility`);
        let compatibility = _compatibility ? parseInt(_compatibility) : 0;
        return compatibility;
    }

    public getShowPhotoInSearchResults(uid: string): boolean {
        let _showPhotoInSearchResults = localStorage.getItem(`${uid} showPhotoInSearchResults`);
        let showPhotoInSearchResults = _showPhotoInSearchResults ? _showPhotoInSearchResults === 'true' : false;
        return showPhotoInSearchResults;
    }

    public getSex(uid: string): number {
        let _sex = localStorage.getItem(`${uid} sex`);
        let sex = _sex ? parseInt(_sex) : 0;
        return sex;
    }

    init(): void {
        let birthday = (new Date()).toISOString();
        this.preferences.next({
            birthday: birthday,
            communication: 0,
            compatibility: 0,
            screenName: getZodiacSign(birthday),
            showPhotoInSearchResults: false,
            sex: 0
        });
    }

    load(uid: string): void {
        this.preferences.next({
            birthday: this.getBirthday(uid),
            communication: this.getComunication(uid),
            compatibility: this.getCompatibility(uid),
            screenName: this.getScreenName(uid),
            showPhotoInSearchResults: this.getShowPhotoInSearchResults(uid),
            sex: this.getSex(uid)
        });
    }
  
}