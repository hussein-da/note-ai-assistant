
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, getCurrentUser, signIn, signOut, signUp, updateProfile, supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (fullName: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name,
        });
      } else {
        setUser(null);
      }
    });

    // THEN check for existing session
    const fetchUser = async () => {
      try {
        const { user, error } = await getCurrentUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          setUser(null);
        } else if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name,
          });
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registrierung erfolgreich",
        description: "Bitte überprüfe deine E-Mails, um dein Konto zu bestätigen.",
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message || "Bei der Registrierung ist ein Fehler aufgetreten",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name,
        });
        
        toast({
          title: "Login erfolgreich",
          description: `Willkommen zurück${data.user.user_metadata?.full_name ? ', ' + data.user.user_metadata.full_name : ''}!`,
        });
        
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Login fehlgeschlagen",
        description: error.message || "Bitte überprüfe deine Zugangsdaten und versuche es erneut",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      toast({
        title: "Abgemeldet",
        description: "Du wurdest erfolgreich abgemeldet",
      });
      
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Abmeldung fehlgeschlagen",
        description: error.message || "Bei der Abmeldung ist ein Fehler aufgetreten",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProfile = async (fullName: string) => {
    setIsLoading(true);
    try {
      const { error } = await updateProfile(fullName);
      
      if (error) {
        throw error;
      }
      
      // Update local user state
      if (user) {
        setUser({
          ...user,
          full_name: fullName,
        });
      }
      
      toast({
        title: "Profil aktualisiert",
        description: "Dein Profil wurde erfolgreich aktualisiert",
      });
    } catch (error: any) {
      toast({
        title: "Aktualisierung fehlgeschlagen",
        description: error.message || "Bei der Aktualisierung deines Profils ist ein Fehler aufgetreten",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
    updateProfile: handleUpdateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
