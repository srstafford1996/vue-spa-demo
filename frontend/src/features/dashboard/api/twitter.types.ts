/*
// features/dashboard/api/twitter.types.ts
//
// Types here define API input and output schema
*/

export type RawTwitterUser = {
    id: number;
    name: string;
    username: string;
    profile_image_url: string;
    public_metrics: {
        followers_count: number;
        following_count: number;
        tweet_count: number;
        listed_count: number;
        like_count: number;
        media_count: number;
    }
}

export type RawTwitterPost = {
    id: string;
    text: string;
    created_at: string;
    edit_history_tweet_ids: [
        number
    ];
    public_metrics: {
        retweet_count: number;
        reply_count: number;
        like_count: number;
        quote_count: number;
        bookmark_count: number;
        impression_count: number;
    };
}

export type RawTwitterMediaInfo = {
    url: string;
    height: number;
    type: string;
    media_key: string;
    width: number;
}


// Timeline Payload
export type RawTwitterTimeline = {
    user: RawTwitterUser;
    tweets: {
        data: RawTwitterPost[];
        includes: {
            media: RawTwitterMediaInfo[]
        };
    };
}