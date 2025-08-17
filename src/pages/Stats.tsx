import React, { useEffect, useState } from 'react';
import { BarChart3, Users, Timer, Trophy, TrendingUp } from 'lucide-react';
import { getGameStats, type GameStats } from '@/services/statsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Stats() {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const gameStats = await getGameStats();
        if (gameStats) {
          setStats(gameStats);
        } else {
          setError('Impossible de charger les statistiques');
        }
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin text-4xl">📊</div>
          <p className="text-muted-foreground">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">⚠️</div>
          <p className="text-muted-foreground">{error || 'Aucune donnée disponible'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">📊 Statistiques du jeu</h1>
          <p className="text-muted-foreground">Découvrez les performances de tous les joueurs</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Parties jouées</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
              <p className="text-xs text-muted-foreground">
                Total depuis le lancement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Films trouvés</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMoviesGuessed}</div>
              <p className="text-xs text-muted-foreground">
                Tous joueurs confondus
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}</div>
              <p className="text-xs text-muted-foreground">
                Points par partie
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps moyen</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(stats.averageTime)}</div>
              <p className="text-xs text-muted-foreground">
                Par partie
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Movies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Films les plus trouvés
              </CardTitle>
              <CardDescription>
                Classement des films les plus souvent devinés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topMovies.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Aucune donnée disponible
                  </p>
                ) : (
                  stats.topMovies.slice(0, 10).map((movie, index) => (
                    <div key={movie.title} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{movie.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Temps moyen: {formatTime(movie.averageTime)}
                          </p>
                        </div>
                      </div>
                      <Badge>
                        {movie.timesGuessed} fois
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Parties récentes
              </CardTitle>
              <CardDescription>
                Les 20 dernières parties jouées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentSessions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Aucune partie enregistrée
                  </p>
                ) : (
                  stats.recentSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{session.playerNickname}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(session.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{session.totalScore} pts</p>
                        <p className="text-sm text-muted-foreground">
                          {formatTime(session.totalTime)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}