import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  
  constructor() {}

  roomId: string = 'salon 1';
  userId: string | null = null;
  playerUsername: string = '';
  opponentUsername: string = '';
  board: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ];
  currentPlayer: string = 'X';
  gameOver: boolean = false;
  winner: string | null = null;
  isMyTurn: boolean = true;
  playerSymbol: string = 'X';
  showBoxscore: boolean = false;
  users: any[] = [];
  bestUsers: any[] = [];
  participants: any[] = [];

  playerAvatar: string = 'assets/avatars/avatar1.png'; // Avatar par défaut
  opponentAvatar: string = 'assets/avatars/avatar2.png'; // Avatar par défaut de l'adversaire

  startTime: number = 0;
  gameDuration: string = '';
}
