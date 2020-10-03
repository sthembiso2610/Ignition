import { Injectable, resolveForwardRef } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DbService } from '../services/db.service';
import { Store } from '@ngxs/store';
import { DocumentReference, AngularFirestore } from '@angular/fire/firestore';
import { SetUser, Initiate } from '../state/app.actions';
import 'firebase/firestore';
import { switchMap } from 'rxjs/operators';
import { IGNUser } from '../models/user.model';
import { Observable, of } from 'rxjs';
import { firestore } from 'firebase';
import { FlashService } from './flash.service';
import { Company } from '../models/company.model';
import { Employee } from '../models/employee.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	user$: Observable<IGNUser>;
	secondaryApp = firebase.initializeApp(environment.firebaseConfig, 'Secondary');

	constructor(
		private afAuth: AngularFireAuth,
		private loading: NgxSpinnerService,
		private router: Router,
		private flash: FlashService,
		private db: DbService,
		private store: Store,
		private fs: AngularFirestore
	) {
		this.user$ = this.afAuth.authState.pipe(
			switchMap((user) => {
				// Logged in
				if (user) {
					firestore().doc(`AllUsers/${user.uid}`).get().then((doc) => {
						this.store.dispatch(new Initiate({ uid: doc.id, ...doc.data() }));
					});

					return this.fs.doc<IGNUser>(`AllUsers/${user.uid}`).valueChanges();
				} else {
					// Logged out
					return of(null);
				}
			})
		);
		this.user$.subscribe();
	}

	signUpEmpWithEmail(data: { password: string; user: IGNUser; company: Company }) {
		this.afAuth.createUserWithEmailAndPassword(data.user.email, data.password).then(async (cred) => {
			data.user.uid = cred.user.uid;
			data.user.companyID = cred.user.uid;
			this.db
				.createUser(data)
				.then(async () => {
					let doc = await this.fs.doc(`AllUsers/${cred.user.uid}`).get().toPromise();
					this.store.dispatch(new SetUser(doc.data()));
					this.loading.hide();
					this.router.navigate([ '/dashboard' ]);
				})
				.catch((error) => {
					this.loading.hide();
					this.flash.open(error.message, 'danger');
				});
		});
	}

	sendresetEmail(email: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.afAuth
				.sendPasswordResetEmail(email)
				.then(() => {
					resolve();
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	signUpClientWithEmail(data: { password: string; user: IGNUser }) {

		this.afAuth.createUserWithEmailAndPassword(data.user.email, data.password).then(async (cred) => {
      data.user.uid = cred.user.uid;
			this.db
				.createClientUser(data.user)
				.then(async () => {

					let doc = await this.fs.doc(`companies/${data.user.companyID}/Clients/${this.db.client.uid}`).get().toPromise();
					this.store.dispatch(new SetUser(doc.data()));
					this.loading.hide();
					this.router.navigate([ '/dashboard' ]);
				})
				.catch((error) => {
					this.loading.hide();
					this.flash.open(error.message, 'danger');
				});
		});
	}

	signIn(data: { email: string; password: string }) {
		return new Promise<firebase.auth.UserCredential>((resolve, reject) => {
			this.afAuth
				.signInWithEmailAndPassword(data.email, data.password)
				.then(async (cred) => {
					const user = cred.user;
          const doc = await firestore().doc(`companies/${this.db.client.companyID}/Clients/${user.uid}`).get();
          console.log(cred)
					this.store.dispatch(new SetUser({ uid: doc.id, ...doc.data() }));
					resolve(cred);
				})
				.catch((e) => {
					reject(e);
				});
		});
	}

	signUpEmp(data: { user: IGNUser }) {
		return new Promise((resolve, reject) => {
			const ref: DocumentReference = firestore().collection('users').doc();
			const password = ref.id.substr(0, 8);
			this.secondaryApp.auth().createUserWithEmailAndPassword(data.user.email, password).then((cred) => {
				data.user.uid = cred.user.uid;
				data.user.password = password;
				this.db
					.createEmp(data.user)
					.then(async () => {
						resolve();
					})
					.catch((error) => {
						reject(error);
					});
			});
		});
	}

	async signOut() {
		await this.afAuth.signOut();
		this.store.dispatch(new SetUser({ name: '', firstname: '', lastname: '' }));
		this.router.navigate([ '/auth' ]);
		this.flash.open('Singed Out', 'info');
	}
}
