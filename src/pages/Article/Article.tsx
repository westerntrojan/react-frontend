import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {Helmet} from 'react-helmet';
import Typography from '@material-ui/core/Typography';
import {useParams, useHistory} from 'react-router';
import SortIcon from '@material-ui/icons/Sort';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import './style.scss';
import PageLoader from '@components/PageLoader';
import {RemoveModal} from '@components/modals';
import FullArticle from './components/FullArticle';
import CommentForm from './components/CommentForm';
import Comment from './components/Comment';
import {addViews, removeArticle, addComment, removeComment} from '@store/articles/actions';
import {RootState} from '@store/types';
import {IComment} from '@store/types';
import {
	addLike,
	addCommentLike,
	addCommentDislike,
	sortCommentsByTopArticles,
	sortCommentsByNewestFirst,
} from '@store/articles/actions';
import {useArticle} from '@utils/hooks';
import ZoomTooltip from '@components/tooltips/ZoomTooltip';

const Article: React.FC = () => {
	const {slug} = useParams();
	const history = useHistory();

	const [removeArticleModal, setRemoveArticleModal] = useState(false);
	const [loading, setLoading] = useState(true);
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const [article, setArticleSlug] = useArticle();

	const openSortMenu = (e: React.MouseEvent<HTMLButtonElement>): void => {
		setAnchorEl(e.currentTarget);
	};

	const closeSortMenu = (): void => {
		setAnchorEl(null);
	};

	const auth = useSelector((state: RootState) => state.auth, shallowEqual);
	const dispatch = useDispatch();

	const setViews = useCallback(() => {
		if (loading) {
			if (article) {
				dispatch(addViews(article._id));

				setLoading(false);
			}
		}
	}, [article, dispatch, loading]);

	useEffect(() => {
		if (slug) {
			setArticleSlug(slug);
		}

		setViews();
	}, [slug, setArticleSlug, setViews]);

	const openRemoveArticleModal = (): void => {
		setRemoveArticleModal(true);
	};

	const handleLike = (): void => {
		if (article && auth) {
			dispatch(addLike(article._id, auth.user._id));
		}
	};

	const handleRemoveArticle = async (): Promise<void> => {
		if (article) {
			await dispatch(removeArticle(article._id));

			setRemoveArticleModal(false);

			history.push('/');
		}
	};

	const handleRemoveComment = async (commentId: string): Promise<void> => {
		await dispatch(removeComment(commentId));
	};

	const handleSubmitCommentForm = async (text: string): Promise<any> => {
		if (article) {
			const data: any = await dispatch(
				addComment({text, articleId: article._id, user: auth.user._id}),
			);

			if (data.errors) {
				return data.errors[0];
			}
		}
	};

	const _handleTopCommentsSort = (): void => {
		if (article) {
			dispatch(sortCommentsByTopArticles(article._id));
		}

		closeSortMenu();
	};

	const _handleNewestFirstSort = (): void => {
		if (article) {
			dispatch(sortCommentsByNewestFirst(article._id));
		}

		closeSortMenu();
	};

	const handleAddCommentLike = async (commentId: string): Promise<void> => {
		if (!auth.isAuth) {
			return history.push('/auth');
		}

		if (article) {
			await dispatch(addCommentLike(article._id, commentId));
		}
	};

	const handleAddCommentDislike = async (commentId: string): Promise<void> => {
		if (!auth.isAuth) {
			return history.push('/auth');
		}

		if (article) {
			await dispatch(addCommentDislike(article._id, commentId));
		}
	};

	if (loading) {
		return <PageLoader />;
	}

	return (
		<section className='article'>
			<Helmet>
				<title>
					{article ? article.title : 'Article'} / {process.env.REACT_APP_TITLE}
				</title>
			</Helmet>

			{article && (
				<>
					<FullArticle
						article={article}
						auth={auth}
						handleLike={handleLike}
						handleRemove={openRemoveArticleModal}
					/>
					<div className='comments'>
						<div className='comments-title'>
							<Typography variant='h5' className='caption'>
								{article.comments.length} Comments
							</Typography>

							<ZoomTooltip title='Sort comments'>
								<Button size='small' startIcon={<SortIcon />} onClick={openSortMenu}>
									Sort by
								</Button>
							</ZoomTooltip>
							<Menu
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={closeSortMenu}
							>
								<MenuItem onClick={_handleTopCommentsSort}>Top Comments</MenuItem>
								<MenuItem onClick={_handleNewestFirstSort}>Newest first</MenuItem>
							</Menu>
						</div>

						<CommentForm auth={auth} handleSubmit={handleSubmitCommentForm} />

						{article.comments.map((comment: IComment) => (
							<Comment
								comment={comment}
								key={comment._id}
								auth={auth}
								handleLike={handleAddCommentLike}
								handleDislike={handleAddCommentDislike}
								handleRemove={handleRemoveComment}
							/>
						))}
					</div>
				</>
			)}

			<RemoveModal
				open={removeArticleModal}
				text='Do you want to remove this article ?'
				action={handleRemoveArticle}
				closeModal={(): void => setRemoveArticleModal(false)}
			/>
		</section>
	);
};

export default Article;
