package BackEnd.Rentary.Properties.DTOs;

import java.util.List;

public record CustomPageResponse<T>(
   List<T> content,
   int totalPages,
   long totalElements,
   int currentPage
) {}
