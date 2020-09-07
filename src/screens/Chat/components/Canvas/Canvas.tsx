import React, {useState, useEffect, useRef, useContext} from 'react';
import Paper from '@material-ui/core/Paper';
import {makeStyles} from '@material-ui/core/styles';
import {useSnackbar} from 'notistack';

import Loader from '@components/common/loaders/Loader';
import {RemoveMessageModal} from '@components/common/modals';
import Header from './components/Header';
import Message from './components/Message';
import Form from './components/Form';
import ImageModal from './components/ImageModal';
import MyMessage from '@components/common/chats/MyMessage';
import AlterHeader from '@components/common/chats/AlterHeader';
import {IMessage} from '@components/common/chats/types';
import Context from '@screens/Chat/context';
import {validateImage} from '@utils/images';

const useStyles = makeStyles({
	root: {
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
	},
	messages: {
		overflow: 'auto',
		flex: 1,
		position: 'relative',
	},
});

type Props = {
	messages: IMessage[];
	auth: {
		isAuth: boolean;
		user: {
			_id: string;
		};
	};
	removed: boolean;
	loading: boolean;
	loadMore: () => void;
	handleRemoveMessages: (messages: string[]) => void;
};

const Canvas: React.FC<Props> = ({
	messages,
	auth,
	removed,
	loading,
	loadMore,
	handleRemoveMessages,
}) => {
	const classes = useStyles();

	const [alterHeader, setAlterHeader] = useState(false);
	const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
	const [removeMessagesModal, setRemoveMessagesModal] = useState(false);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState('');
	const [imageModal, setImageModal] = useState(false);
	const messagesContainer = useRef<HTMLDivElement>(null);

	const {handleSubmitMessage} = useContext(Context);

	const {enqueueSnackbar} = useSnackbar();

	useEffect(() => {
		if (!removed && messagesContainer.current) {
			messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
		}
	}, [messages, removed]);

	const openRemoveMessagesModal = (): void => {
		setRemoveMessagesModal(true);
	};

	const selectMessage = (_id: string): void => {
		if (!alterHeader) {
			setAlterHeader(true);
		}

		if (selectedMessages.includes(_id)) {
			setSelectedMessages(selectedMessages.filter(message => message !== _id));
		} else {
			setSelectedMessages(selectedMessages.concat(_id));
		}
	};

	const closeAlterHeader = (): void => {
		setAlterHeader(false);
		setSelectedMessages([]);
	};

	const removeMessages = (): void => {
		handleRemoveMessages(selectedMessages);
		setSelectedMessages([]);
		closeAlterHeader();
		setRemoveMessagesModal(false);
	};

	const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (e.target.files && e.target.files.length) {
			const file = e.target.files[0];

			const validationResult = validateImage(file);

			if (validationResult.success) {
				setImageFile(file);

				const reader = new FileReader();

				reader.onload = (data: any): void => {
					setImagePreview(data.target.result);
				};

				reader.readAsDataURL(file);

				setImageModal(true);
			} else {
				enqueueSnackbar(validationResult.message, {variant: 'error'});
			}
		}
	};

	const handleSubmit = (data: {type: string; text?: string; caption?: string}): void => {
		const {type, text = '', caption = ''} = data;

		handleSubmitMessage({type, text, caption, image: imageFile});

		setImageFile(null);
		setImagePreview('');
	};

	const _handleMessagesScroll = (e: React.UIEvent<HTMLDivElement>): void => {
		// scrollTop/Left - расстояние от верха/лево блока (можно переопределять)
		// scrollWidth/Height - длина блока включая скролл
		// clientWidth/Height, offsetWidth/Height - длина блока не включая скролл
		// if (e.currentTarget.scrollTop === 0) {
		// loadMore();
		// }
	};

	return (
		<Paper className={classes.root}>
			{alterHeader && selectedMessages.length ? (
				<AlterHeader
					selectedMessages={selectedMessages.length}
					closeAlterHeader={closeAlterHeader}
					openRemoveMessagesModal={openRemoveMessagesModal}
				/>
			) : (
				<Header />
			)}

			<div className={classes.messages} ref={messagesContainer} onScroll={_handleMessagesScroll}>
				{loading && <Loader />}

				{auth.user &&
					messages &&
					messages.map(message => {
						if (message.user._id === auth.user._id) {
							if (message._id === messages[0]._id) {
								return (
									<MyMessage
										key={message._id}
										message={message}
										selectMessage={selectMessage}
										alterHeader={alterHeader}
									/>
								);
							}

							return (
								<MyMessage
									message={message}
									key={message._id}
									selectMessage={selectMessage}
									alterHeader={alterHeader}
								/>
							);
						}

						return <Message message={message} key={message._id} />;
					})}

				{!auth.user &&
					messages &&
					messages.map(message => <Message message={message} key={message._id} />)}
			</div>

			<Form auth={auth} handleSubmit={handleSubmit} handleChangeImage={handleChangeImage} />

			<RemoveMessageModal
				selectedMessages={selectedMessages.length}
				open={removeMessagesModal}
				action={removeMessages}
				closeModal={(): void => setRemoveMessagesModal(false)}
			/>
			<ImageModal
				open={imageModal}
				imagePreview={imagePreview}
				handleSubmit={handleSubmit}
				closeModal={(): void => setImageModal(false)}
			/>
		</Paper>
	);
};

export default Canvas;