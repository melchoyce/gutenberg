/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import {
	getEntityRecord,
	getEntityRecords,
	getEmbedPreview,
	isPreviewEmbedFallback,
	getAutosave,
	hasAutosave,
} from '../selectors';

describe( 'getEntityRecord', () => {
	it( 'should return undefined for unknown record’s key', () => {
		const state = deepFreeze( {
			entities: {
				data: {
					root: {
						postType: {
							items: {},
							queries: {},
						},
					},
				},
			},
		} );
		expect( getEntityRecord( state, 'root', 'postType', 'post' ) ).toBe( undefined );
	} );

	it( 'should return a record by key', () => {
		const state = deepFreeze( {
			entities: {
				data: {
					root: {
						postType: {
							items: {
								post: { slug: 'post' },
							},
							queries: {},
						},
					},
				},
			},
		} );
		expect( getEntityRecord( state, 'root', 'postType', 'post' ) ).toEqual( { slug: 'post' } );
	} );
} );

describe( 'getEntityRecords', () => {
	it( 'should return an null by default', () => {
		const state = deepFreeze( {
			entities: {
				data: {
					root: {
						postType: {
							items: {},
							queries: {},
						},
					},
				},
			},
		} );
		expect( getEntityRecords( state, 'root', 'postType' ) ).toBe( null );
	} );

	it( 'should return all the records', () => {
		const state = deepFreeze( {
			entities: {
				data: {
					root: {
						postType: {
							items: {
								post: { slug: 'post' },
								page: { slug: 'page' },
							},
							queries: {
								'': [ 'post', 'page' ],
							},
						},
					},
				},
			},
		} );
		expect( getEntityRecords( state, 'root', 'postType' ) ).toEqual( [
			{ slug: 'post' },
			{ slug: 'page' },
		] );
	} );
} );

describe( 'getEmbedPreview()', () => {
	it( 'returns preview stored for url', () => {
		let state = deepFreeze( {
			embedPreviews: {},
		} );
		expect( getEmbedPreview( state, 'http://example.com/' ) ).toBe( undefined );

		state = deepFreeze( {
			embedPreviews: {
				'http://example.com/': { data: 42 },
			},
		} );
		expect( getEmbedPreview( state, 'http://example.com/' ) ).toEqual( { data: 42 } );
	} );
} );

describe( 'isPreviewEmbedFallback()', () => {
	it( 'returns true if the preview html is just a single link', () => {
		const state = deepFreeze( {
			embedPreviews: {
				'http://example.com/': { html: '<a href="http://example.com/">http://example.com/</a>' },
			},
		} );
		expect( isPreviewEmbedFallback( state, 'http://example.com/' ) ).toEqual( true );
	} );
} );

describe( 'hasAutosave', () => {
	it( 'returns false if there is no autosave', () => {
		const state = { autosave: {} };
		const result = hasAutosave( state, { id: 1 } );

		expect( result ).toBe( false );
	} );

	it( 'returns true if there is an autosave', () => {
		const postId = 1;
		const state = {
			autosave: {
				[ postId ]: { title: '', excerpt: '', content: '' },
			},
		};

		const result = hasAutosave( state, { id: postId } );

		expect( result ).toBe( true );
	} );
} );

describe( 'getAutosave', () => {
	it( 'returns undefined for the provided post id if no autosave exists for it in state', () => {
		const autosave = { title: '', excerpt: '', content: '' };
		const state = {
			autosave: {
				1: autosave,
			},
		};

		const result = getAutosave( state, { id: 2 } );

		expect( result ).toBeUndefined();
	} );

	it( 'returns the autosave for the provided post id, if it exists in state', () => {
		const postId = 1;
		const autosave = { title: '', excerpt: '', content: '' };
		const state = {
			autosave: {
				[ postId ]: autosave,
			},
		};

		const result = getAutosave( state, { id: postId } );

		expect( result ).toEqual( autosave );
	} );
} );
