import {IUser} from '@store/types';

export interface IMessage {
	_id: string;
	image: string;
	caption: string;
	user: IUser;
	text: string;
	created: string;
}