// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendPushNotificationForNewMessage = functions.database.ref('/chat-messages/{sessionId}/{messageId}').onCreate((snapshot, context) => {
	const sessionId = context.params.sessionId;
	const messageId = context.params.messageId;
	console.log("New Message" + messageId + " in session " + sessionId);
	const messageData = snapshot.val();
	const messageContent = messageData.content;
	const messageSenderName = messageData.sender_username;
	const messageReceiverUID = messageData.receiver_uid;
	const payload = {
		notification: {
			title: 'Buddyspot',
			body: 'New message from ' + messageSenderName,
			badge: "1",
			sound: 'default',
		}
	};
	return admin.database().ref('user-ios-system-notifications/'+messageReceiverUID+"/deviceToken").once('value').then(snapshot => {
		if (snapshot.val()) {
			const token = snapshot.val();
			return admin.messaging().sendToDevice(token, payload).then(response => {
				return null;
			});
		} else {
			return null;
		}
	});
});

exports.sendPushNotificationForBuddyRequests = functions.database.ref('user-notifications/{uid}/buddy-requests/{notiId}').onCreate((snapshot, context) => {
	const notiData = snapshot.val();
	const requestSenderName = notiData.username;
	const notiReceiverUID = context.params.uid
	const payload = {
		notification: {
			title: "Buddyspot",
			body: requestSenderName + " sent you a buddy request",
			badge: "1",
			sound: 'default',
		}
	};
	return admin.database().ref('user-ios-system-notifications/'+notiReceiverUID+"/deviceToken").once('value').then(snapshot => {
		if (snapshot.val()) {
			const token = snapshot.val();
			return admin.messaging().sendToDevice(token, payload).then(response => {
				return null;
			});
		} else {
			return null;
		}
	});
});


exports.sendPushNotificationForRecentNotifications = functions.database.ref('user-notifications/{uid}/accepts-and-bread/{notiId}').onCreate((snapshot, context) => {
	const notiData = snapshot.val();
	const requestSenderName = notiData.username;
	const notiActivity = notiData.activity;
	const notiReceiverUID = context.params.uid


	const payload = {
		notification: {
			title: "Buddyspot",
			body: requestSenderName + " " + notiActivity,
			badge: "1",
			sound: 'default',
		}
	};
	return admin.database().ref('user-ios-system-notifications/'+notiReceiverUID+"/deviceToken").once('value').then(snapshot => {
		if (snapshot.val()) {
			const token = snapshot.val();
			return admin.messaging().sendToDevice(token, payload).then(response => {
				return null;
			});
		} else {
			return null;
		}
	});
});

