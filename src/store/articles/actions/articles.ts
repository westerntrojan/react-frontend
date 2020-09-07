import {createAction} from '@reduxjs/toolkit';

import callApi from '@utils/callApi';
import {AppThunk} from '@store/types';
import * as types from '../types';

export const fetchArticles = (): AppThunk => async (dispatch, getState): Promise<void> => {
	const skip = getState().articles.all.length;

	const data = await callApi.get(`/articles?skip=${skip}`);

	if (data.articles.length < 10) {
		dispatch({
			type: types.END_ARTICLES,
			payload: {
				articles: data.articles,
			},
		});
	} else {
		dispatch({
			type: types.FETCH_ARTICLES,
			payload: {
				articles: data.articles,
			},
		});
	}
};

export const getArticles = (): AppThunk => async (dispatch): Promise<void> => {
	const data = await callApi.get('/articles');

	dispatch({
		type: types.GET_ARTICLES,
		payload: {
			articles: data.articles,
		},
	});
};

export const getArticle = (slug: string): AppThunk => async (dispatch): Promise<void> => {
	const data = await callApi.get(`/articles/${slug}`);

	dispatch({
		type: types.GET_ARTICLE,
		payload: {
			article: data.article,
		},
	});
};

export const addArticle = (article: object): AppThunk => async (dispatch): Promise<object> => {
	const data = await callApi.post('/articles', article);

	if (data.success) {
		dispatch({
			type: types.ADD_ARTICLE,
			payload: {
				article: data.article,
			},
		});
	}

	return data;
};

export const editArticle = ({
	articleId,
	formData,
}: {
	articleId: string;
	formData: FormData;
}): AppThunk => async (dispatch): Promise<object> => {
	const data = await callApi.put(`/articles/${articleId}`, formData);

	if (data.success) {
		dispatch({
			type: types.EDIT_ARTICLE,
			payload: {
				article: data.article,
			},
		});
	}

	return data;
};

export const removeArticle = (articleId: string): AppThunk => async (dispatch): Promise<void> => {
	await callApi.delete(`/articles/${articleId}`);

	dispatch({
		type: types.REMOVE_ARTICLE,
		payload: {
			articleId,
		},
	});
};

export const addViews = createAction(types.ADD_VIEWS, articleId => ({
	payload: {
		articleId,
	},
}));

export const addLike = createAction(types.ADD_LIKE, articleId => ({
	payload: {
		articleId,
	},
}));

export const addDislike = createAction(types.ADD_DISLIKE, articleId => ({
	payload: {
		articleId,
	},
}));

export const addToBookmarks = (articleId: string, userId: string): AppThunk => async (
	dispatch,
): Promise<void> => {
	const data = await callApi.get(`/articles/bookmarks/${articleId}/${userId}`);

	if (data.success) {
		if (data.added) {
			dispatch({
				type: types.ADD_TO_BOOKMARKS,
				payload: {
					articleId,
				},
			});
		} else if (data.removed) {
			dispatch({
				type: types.REMOVE_FROM_BOOKMARKS,
				payload: {
					articleId,
				},
			});
		}
	}
};
