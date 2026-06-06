-- Create blackjack_lobbies table
CREATE TABLE IF NOT EXISTS blackjack_lobbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(6) UNIQUE NOT NULL,
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_state VARCHAR(20) DEFAULT 'waiting' CHECK (game_state IN ('waiting', 'betting', 'playing', 'finished')),
  deck JSONB DEFAULT '[]'::jsonb,
  dealer_hand JSONB DEFAULT '[]'::jsonb,
  current_player_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blackjack_players table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS blackjack_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lobby_id UUID REFERENCES blackjack_lobbies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  chips INTEGER DEFAULT 1000,
  hand JSONB DEFAULT '[]'::jsonb,
  current_bet INTEGER DEFAULT 0,
  is_ready BOOLEAN DEFAULT FALSE,
  is_host BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(lobby_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blackjack_lobbies_code ON blackjack_lobbies(code);
CREATE INDEX IF NOT EXISTS idx_blackjack_lobbies_host_id ON blackjack_lobbies(host_id);
CREATE INDEX IF NOT EXISTS idx_blackjack_players_lobby_id ON blackjack_players(lobby_id);
CREATE INDEX IF NOT EXISTS idx_blackjack_players_user_id ON blackjack_players(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_blackjack_lobbies_updated_at
  BEFORE UPDATE ON blackjack_lobbies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE blackjack_lobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE blackjack_players ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blackjack_lobbies
-- Anyone can read lobbies (to join)
CREATE POLICY "Anyone can read lobbies"
  ON blackjack_lobbies FOR SELECT
  USING (true);

-- Only authenticated users can create lobbies
CREATE POLICY "Authenticated users can create lobbies"
  ON blackjack_lobbies FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Host can update their lobby
CREATE POLICY "Host can update their lobby"
  ON blackjack_lobbies FOR UPDATE
  USING (auth.uid() = host_id);

-- Host can delete their lobby
CREATE POLICY "Host can delete their lobby"
  ON blackjack_lobbies FOR DELETE
  USING (auth.uid() = host_id);

-- RLS Policies for blackjack_players
-- Anyone can read players in a lobby
CREATE POLICY "Anyone can read players"
  ON blackjack_players FOR SELECT
  USING (true);

-- Authenticated users can join lobbies
CREATE POLICY "Authenticated users can join lobbies"
  ON blackjack_players FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Players can update their own player record
CREATE POLICY "Players can update their own record"
  ON blackjack_players FOR UPDATE
  USING (auth.uid() = user_id);

-- Players can leave (delete their record)
CREATE POLICY "Players can leave lobby"
  ON blackjack_players FOR DELETE
  USING (auth.uid() = user_id);

-- Host can delete any player (kick)
CREATE POLICY "Host can kick players"
  ON blackjack_players FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM blackjack_lobbies
      WHERE blackjack_lobbies.id = blackjack_players.lobby_id
      AND blackjack_lobbies.host_id = auth.uid()
    )
  );


