// Complex TypeScript file - should get medium score with suggestions
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

class UserManager {
  private users: User[] = [];

  addUser(user: User): void {
    if (user.id && user.name && user.email) {
      if (user.role === 'admin') {
        if (this.hasAdminPrivileges(user)) {
          if (this.validateEmail(user.email)) {
            if (!this.userExists(user.id)) {
              this.users.push(user);
              console.log(`User ${user.name} added successfully`);
            } else {
              console.log('User already exists');
            }
          } else {
            console.log('Invalid email format');
          }
        } else {
          console.log('Insufficient admin privileges');
        }
      } else if (user.role === 'user') {
        if (this.validateEmail(user.email)) {
          if (!this.userExists(user.id)) {
            this.users.push(user);
            console.log(`User ${user.name} added successfully`);
          } else {
            console.log('User already exists');
          }
        } else {
          console.log('Invalid email format');
        }
      } else {
        this.users.push(user);
        console.log(`Guest ${user.name} added successfully`);
      }
    } else {
      console.log('Missing required user information');
    }
  }

  private hasAdminPrivileges(user: User): boolean {
    // Duplicate logic - should be flagged
    if (user.role === 'admin') {
      return true;
    }
    return false;
  }

  private validateEmail(email: string): boolean {
    // Duplicate logic - should be flagged
    if (email.includes('@') && email.includes('.')) {
      return true;
    }
    return false;
  }

  private userExists(id: number): boolean {
    // Duplicate logic - should be flagged
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        return true;
      }
    }
    return false;
  }

  getUsers(): User[] {
    return this.users;
  }
}

export { UserManager, User };