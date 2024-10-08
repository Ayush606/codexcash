import { Client, Account, ID, Databases, Functions, Query, Permission, Role, Storage } from 'appwrite';
export const client = new Client();
const account = new Account(client);
const databases = new Databases(client);
const functions = new Functions(client);
const storage = new Storage(client);

client
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT)
    .setEndpointRealtime('wss://cloud.codexcash.com/v1/realtime')
    .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);


// account signup
export const signUp = (email, password, name) => {
    return account.create(ID.unique(), email, password, name);
}

// account login
export const login = (email, password) => {
    return account.createEmailPasswordSession(email, password);
};

// account logout
export const logout = () => {
    return account.deleteSession('current');
};

// getting current user
export const getUser = () => {
    return account.get();
};

// getting user data
export const getUserData = (userId) => {
    return databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_USERS_COLLECTION_ID,
        [Query.equal('user_id', userId)]
    );
};

// uploading contest image
export const uploadImage = (image) => {
    return storage.createFile(
        process.env.NEXT_PUBLIC_CONTEST_IMAGES_BUCKET_ID,
        ID.unique(),
        image,
    );
};

// image preview url
export const getImage = async (imageId) => {
    const image = storage.getFilePreview(
        process.env.NEXT_PUBLIC_CONTEST_IMAGES_BUCKET_ID,
        imageId
    );
    return image.href;
};

// adding contest in contest collection
export const createContest = async (client_id, title, description, reward, deadline, created_at, rich_text) => {
    return databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_CONTESTS_COLLECTION_ID,
        ID.unique(),
        {
            client_id,
            title,
            description,
            reward,
            deadline,
            created_at,
            rich_text
        },
        [Permission.update([Role.user(client_id)])]
    );
};

// getting contest by id from contest collection
export const getContest = async (contestId) => {
    return await databases.getDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_CONTESTS_COLLECTION_ID,
        contestId
    );
};

// getting users notifcations
export const getNotifications = async (userId) => {
    return await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_NOTIFICATIONS_COLLECTION_ID,
        [Query.equal('user_id', userId)]
    );
};

// updating notification read status
export const updateNotification = async (notificationId) => {
    return await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_NOTIFICATIONS_COLLECTION_ID,
        notificationId,
        { read: true }
    );
};

// creating discussion in discussion collection
export const createDiscussion = async (contest_id, user_id, message, created_at, username) => {
    return await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_DISCUSSION_COLLECTION_ID,
        ID.unique(),
        {
            contest_id,
            user_id,
            message,
            created_at,
            username
        },
        [Permission.update([Role.user(user_id)])]
    );
};

// getting discussions by contest id
export const getDiscussions = async (contestId) => {
    return await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_DISCUSSION_COLLECTION_ID,
        [Query.equal('contest_id', contestId)]
    );
};

// create submission in submission collection
export const createSubmission = async (contest_id, dev_id, rich_text, created_at, username) => {
    return await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_SUBMISSIONS_COLLECTION_ID,
        ID.unique(),
        {
            contest_id,
            dev_id,
            rich_text,
            created_at,
            username
        },
        [Permission.update([Role.user(dev_id)])]
    );
};

// list submissions by contest id
export const listSubmissions = async (contestId) => {
    return await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_SUBMISSIONS_COLLECTION_ID,
        [Query.equal('contest_id', contestId)]
    );
};

// getting submissions by contest_id and dev_id
export const getSubmissions = async (contestId, devId) => {
    return await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_SUBMISSIONS_COLLECTION_ID,
        [Query.equal('contest_id', contestId), Query.equal('dev_id', devId)]
    );
};

// getting contestid by client_id from escrow collection
export const getEscrowedContestIds = async (clientId) => {
    return await databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_ESCROW_COLLECTION_ID,
        [Query.equal('client_id', clientId)]
    );
};

// updating contest with winner_id
export const updateContest = async (contestId, winnerId) => {
    return await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_CONTESTS_COLLECTION_ID,
        contestId,
        { winner_id: winnerId }
    );
};

// getting 
