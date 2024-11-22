import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://skilldev89.pythonanywhere.com/api'; // URL da API Django

  constructor(private http: HttpClient, private storage: Storage) {
    this.initStorage();}
  
  private async initStorage() {
    await this.storage.create();
  }

  // Método para obter o token do Storage
  private async getAuthToken(): Promise<string | null> {
    return await this.storage.get('authToken');
  }

  async getData(endpoint: string): Promise<Observable<any>> {
    const token = await this.getAuthToken();
    console.log(token)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/${endpoint}`, { headers });
  }

  // Método POST com autenticação
  async postData(endpoint: string, data: any, auth: boolean = true): Promise<Observable<any>> {
    const token = await this.getAuthToken();
    console.log(token)
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');;
    return this.http.post(`${this.baseUrl}/${endpoint}`, data, { headers });
  }
  //PUT 
  async putData(endpoint: string, data: any): Promise<Observable<any>> {
    const token = await this.getAuthToken();
    console.log(token)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(this.baseUrl + endpoint, data, { headers });
  }

  // DELETE
  async deleteData(endpoint: string): Promise<Observable<any>> {
    const token = await this.getAuthToken();
    console.log(token)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(this.baseUrl + endpoint, { headers });
  }

  // Método para salvar o token após login
  async saveAuthToken(token: string): Promise<void> {
    await this.storage.set('authToken', token);
  }

  // Método para remover o token (logout)
  async removeAuthToken(): Promise<void> {
    await this.storage.remove('authToken');
  }
}





// const headers = new HttpHeaders({
//   'Authorization': `Bearer ${token}`
// });