# frozen_string_literal: true

class DirectoryColumnsController < ApplicationController
  def index
    directory_columns = DirectoryColumn.includes(:user_field).where(enabled: true).order(:position)
    
  end
end
