import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule} from '@angular/common';
import {AuthService} from '../services/auth-service';
import {AppUser} from '../model/user.model';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsers implements OnInit {

  users: AppUser[] = [];
  loading = false;
  revokingUsername: string | null = null;

  private readonly destroyRef = inject(DestroyRef);

  constructor(public authService: AuthService,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.chargerUtilisateurs();
  }

  chargerUtilisateurs() {
    this.loading = true;
    this.authService.getAllUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toastr.error('Impossible de charger la liste des utilisateurs', 'Erreur');
      }
    });
  }

  getRoles(user: AppUser): string {
    return user.roles?.map(role => role.role).join(', ') ?? '';
  }

  peutRevoquer(user: AppUser): boolean {
    return user.username !== this.authService.loggedUser;
  }

  revoquerSessions(user: AppUser) {
    if (!this.peutRevoquer(user)) {
      this.toastr.warning('Vous ne pouvez pas révoquer votre propre session', 'Action refusée');
      return;
    }

    const message = `Révoquer toutes les sessions de "${user.username}" ?\n` +
      'L\'utilisateur devra se reconnecter.';

    if (!confirm(message)) {
      return;
    }

    this.revokingUsername = user.username;
    this.authService.revokeUserSessions(user.username).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.revokingUsername = null;
        this.toastr.success(`Sessions de ${user.username} révoquées`, 'Succès');
      },
      error: () => {
        this.revokingUsername = null;
        this.toastr.error(`Échec de la révocation pour ${user.username}`, 'Erreur');
      }
    });
  }
}
